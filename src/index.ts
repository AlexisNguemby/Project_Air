// ============================================================
//  index.ts — Point d'entrée du serveur Fastify
//  Ordre d'enregistrement important :
//    1. Plugins globaux (prisma, jwt)
//    2. Routes
// ============================================================

import "dotenv/config";
import Fastify from "fastify";

import prismaPlugin from "./plugins/prisma.plugin.js";
import jwtPlugin from "./plugins/jwt.plugin.js";
import authRoutes from "./modules/auth/auth.routes.js";
import boosterRoutes from "./modules/boosters/boosters.routes.js";

const isDev = process.env.NODE_ENV !== "production";

const fastify = Fastify({
  logger: isDev
    ? { level: "info", transport: { target: "pino-pretty" } }
    : { level: "warn" },
});

async function start() {
  // 1. Plugins (ordre obligatoire : prisma avant les routes, jwt avant les routes)
  await fastify.register(prismaPlugin);
  await fastify.register(jwtPlugin);

  // 2. Routes
  await fastify.register(authRoutes);
  await fastify.register(boosterRoutes);

  // 3. Démarrage
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  await fastify.listen({ port, host });
  fastify.log.info(`🚀 Serveur démarré sur http://${host}:${port}`);
}

// Gestion des erreurs fatales au démarrage
start().catch((err) => {
  console.error("Erreur fatale au démarrage :", err);
  process.exit(1);
});