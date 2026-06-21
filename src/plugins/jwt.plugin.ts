// ============================================================
//  plugins/jwt.plugin.ts — Plugin JWT pour Fastify
//  Ce plugin :
//    1. Enregistre @fastify/jwt avec votre secret
//    2. Expose fastify.authenticate : middleware réutilisable
//       pour protéger n'importe quelle route
// ============================================================

import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default fp(async function jwtPlugin(fastify: FastifyInstance) {

  // Enregistrement du plugin JWT
  // Le secret doit être dans .env : JWT_SECRET=une_longue_chaine_aleatoire
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET ?? (() => {
      throw new Error("JWT_SECRET est manquant dans le fichier .env !");
    })(),
  });

  // Décorateur : fastify.authenticate
  // Utilisez-le dans { onRequest: [fastify.authenticate] } pour protéger une route.
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        // Vérifie le header Authorization: Bearer <token>
        await request.jwtVerify();
      } catch (err) {
        return reply.code(401).send({ error: "Token invalide ou expiré. Veuillez vous reconnecter." });
      }
    }
  );
});

// ---- Déclaration de types pour TypeScript ----
// Sans ça, TypeScript ne sait pas que fastify.authenticate existe.
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
