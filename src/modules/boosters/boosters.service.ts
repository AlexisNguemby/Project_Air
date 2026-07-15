import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { Prisma, PrismaClient } from "@prisma/client";

type CardSeed = {
  id: string;
  name: string;
  faction: string;
  power: number;
  attack: number;
  description: string;
  rarity?: string;
};

type BoosterCard = {
  card_id: number;
  card_name: string;
  card_place: string | null;
  power: number;
  attack: number;
  card_img: string | null;
  faction: {
    faction_id: number;
    faction_name: string;
    image_placeholder: string | null;
  };
};

type BoosterResult = {
  collection_id: number;
  cards: Array<{
    quantity: number;
    card: BoosterCard;
  }>;
};

const BOOSTER_SIZE = 5;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cardsFilePath = join(process.cwd(), "src", "data", "cards.json");

async function loadCardsFromJson(): Promise<CardSeed[]> {
  const rawContent = await readFile(cardsFilePath, "utf-8");
  return JSON.parse(rawContent) as CardSeed[];
}

function pickRandomCards<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

async function seedCardCatalog(prisma: Prisma.TransactionClient): Promise<void> {
  const cards = await loadCardsFromJson();

  for (const card of cards) {
    const faction = await prisma.faction.upsert({
      where: { faction_name: card.faction },
      update: {},
      create: {
        faction_name: card.faction,
        image_placeholder: null,
      },
      select: { faction_id: true },
    });

    await prisma.card.upsert({
      where: { card_name: card.name },
      update: {
        card_place: card.rarity ?? null,
        power: card.power,
        attack: card.attack,
        card_img: null,
        faction_id: faction.faction_id,
      },
      create: {
        card_name: card.name,
        card_place: card.rarity ?? null,
        power: card.power,
        attack: card.attack,
        card_img: null,
        faction_id: faction.faction_id,
      },
    });
  }
}

export async function openBooster(prisma: PrismaClient, accountId: number): Promise<BoosterResult> {
  return prisma.$transaction(async (tx) => {
    await seedCardCatalog(tx);

    const account = await tx.account.findUnique({
      where: { account_id: accountId },
      select: {
        account_id: true,
        collection: {
          select: {
            collection_id: true,
          },
        },
      },
    });

    if (!account || !account.collection) {
      throw new Error("Collection introuvable.");
    }

    const availableCards = await tx.card.findMany({
      select: {
        card_id: true,
        card_name: true,
        card_place: true,
        power: true,
        attack: true,
        card_img: true,
        faction: {
          select: {
            faction_id: true,
            faction_name: true,
            image_placeholder: true,
          },
        },
      },
    });

    const boosterCards = pickRandomCards(availableCards, BOOSTER_SIZE);
    const obtainedCards: BoosterResult["cards"] = [];

    for (const card of boosterCards) {
      const entry = await tx.collectionEntry.upsert({
        where: {
          collection_id_card_id: {
            collection_id: account.collection.collection_id,
            card_id: card.card_id,
          },
        },
        update: {
          quantity: { increment: 1 },
        },
        create: {
          collection_id: account.collection.collection_id,
          card_id: card.card_id,
          quantity: 1,
        },
        select: {
          quantity: true,
          card: {
            select: {
              card_id: true,
              card_name: true,
              card_place: true,
              power: true,
              attack: true,
              card_img: true,
              faction: {
                select: {
                  faction_id: true,
                  faction_name: true,
                  image_placeholder: true,
                },
              },
            },
          },
        },
      }) as { quantity: number; card: BoosterCard };

      obtainedCards.push(entry);
    }

    return {
      collection_id: account.collection.collection_id,
      cards: obtainedCards,
    };
  });
}