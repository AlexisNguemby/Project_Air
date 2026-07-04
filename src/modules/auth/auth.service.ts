// ============================================================
//  auth.service.ts — Logique métier
//  Ce fichier contient UNIQUEMENT la logique : pas de HTTP ici.
//  On sépare ainsi la logique des routes (bonne pratique).
// ============================================================

import bcrypt from "bcrypt";
import type { PrismaClient } from "@prisma/client";

// Nombre de "tours" de hachage bcrypt. 12 est un bon compromis sécurité/performance.
const SALT_ROUNDS = 12;

// ID par défaut attribués à la création d'un compte
// (doivent exister en base — à adapter selon vos seeds)
const DEFAULT_ROLE_ID = 1;  // ex: "player"
const DEFAULT_CLASS_ID = 1; // ex: "novice"

// ---- Types retournés par le service ----

export interface AuthResult {
  account_id: number;
  account_name: string;
  mail: string;
}

// ---- Fonctions ----

/**
 * Crée un nouveau compte.
 * Lève une erreur si le pseudo ou l'email est déjà pris.
 */
export async function registerAccount(
  prisma: PrismaClient,
  data: { account_name: string; mail: string; password: string }
): Promise<AuthResult> {

  // 1. Vérifier les doublons (pseudo + email séparément pour un message précis)
  const existingName = await prisma.account.findUnique({
    where: { account_name: data.account_name },
    select: { account_id: true },
  });
  if (existingName) {
    throw new ConflictError("Ce pseudonyme est déjà utilisé.");
  }

  const existingMail = await prisma.account.findUnique({
    where: { mail: data.mail },
    select: { account_id: true },
  });
  if (existingMail) {
    throw new ConflictError("Cette adresse email est déjà utilisée.");
  }

  // 2. Hacher le mot de passe (jamais stocker en clair !)
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // 3. Créer le compte + la collection vide associée (transaction atomique)
  const account = await prisma.$transaction(async (tx) => {
    const newAccount = await tx.account.create({
      data: {
        account_name: data.account_name,
        mail: data.mail,
        password: hashedPassword,
        role_id: DEFAULT_ROLE_ID,
        class_id: DEFAULT_CLASS_ID,
      },
      select: {
        account_id: true,
        account_name: true,
        mail: true,
      },
    });

    // Crée la collection vide du joueur en même temps
    await tx.collection.create({
      data: { account_id: newAccount.account_id },
    });

    return newAccount;
  });

  return account;
}

/**
 * Vérifie les identifiants et retourne le compte si valides.
 * Lève une erreur générique volontairement vague (sécurité : ne pas
 * indiquer si c'est l'email ou le mot de passe qui est faux).
 */
export async function loginAccount(
  prisma: PrismaClient,
  data: { mail: string; password: string }
): Promise<AuthResult> {

  // 1. Chercher le compte par email
  const account = await prisma.account.findUnique({
    where: { mail: data.mail },
    select: {
      account_id: true,
      account_name: true,
      mail: true,
      password: true, // nécessaire pour la comparaison bcrypt
    },
  });

  // Message identique que le compte n'existe pas ou que le mdp soit faux
  const INVALID_MSG = "Email ou mot de passe incorrect.";

  if (!account) {
    throw new UnauthorizedError(INVALID_MSG);
  }

  // 2. Comparer le mot de passe fourni avec le hash stocké
  const passwordMatch = await bcrypt.compare(data.password, account.password);
  if (!passwordMatch) {
    throw new UnauthorizedError(INVALID_MSG);
  }

  return {
    account_id: account.account_id,
    account_name: account.account_name,
    mail: account.mail,
  };
}

// ---- Erreurs personnalisées ----
// Permet au handler de distinguer les types d'erreurs sans string matching.

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
