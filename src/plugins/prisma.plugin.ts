// ============================================================
//  plugins/prisma.plugin.ts — Plugin Prisma pour Fastify
//  Utilise l'adaptateur MariaDB (comme le reste du projet).
// ============================================================

import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { FastifyInstance } from "fastify";

export default fp(async function prismaPlugin(fastify: FastifyInstance) {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3307),
    user: process.env.DATABASE_USER ?? "project_air_user",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "project_air",
    connectionLimit: 5,
  });

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
  });

  await prisma.$connect();
  fastify.log.info("✅ Prisma connecté à la base de données.");

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
    fastify.log.info("Prisma déconnecté.");
  });
});

// ---- Déclaration de types pour TypeScript ----
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}