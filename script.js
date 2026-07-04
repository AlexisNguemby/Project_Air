import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
const prisma = new PrismaClient({
    adapter: new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
    }),
});
async function main() {
    const card = await prisma.card.upsert({
        where: {
            card_name: "Dragon de feu",
        },
        create: {
            card_name: "Dragon de feu",
            attack: 12,
            power: 8,
            card_img: "dragon.png",
        },
        update: {
            attack: 12,
            power: 8,
            card_img: "dragon.png",
        },
    });
    console.log("Carte créée:", card);
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=script.js.map