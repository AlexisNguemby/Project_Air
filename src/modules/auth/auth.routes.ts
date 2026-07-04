// ============================================================
//  auth.routes.ts — Routes HTTP
//  Déclare POST /auth/register et POST /auth/login.
//  Ce fichier gère uniquement le HTTP : status codes, réponses JSON.
//  La logique est déléguée à auth.service.ts.
// ============================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { registerSchema, loginSchema } from "./auth.schema.js";
import type { RegisterBody, LoginBody } from "./auth.schema.js";
import { registerAccount, loginAccount, ConflictError, UnauthorizedError } from "./auth.service.js";

export default async function authRoutes(fastify: FastifyInstance) {

  // ----------------------------------------------------------
  //  POST /auth/register — Créer un compte
  // ----------------------------------------------------------
  fastify.post<{ Body: RegisterBody }>(
    "/auth/register",
    { schema: registerSchema },
    async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
      try {
        // Le service fait toute la logique (vérif doublons, hash, création)
        const account = await registerAccount(fastify.prisma, request.body);

        // On génère le JWT immédiatement : l'utilisateur est connecté dès l'inscription
        const token = fastify.jwt.sign(
          {
            sub: account.account_id,       // identifiant du compte
            name: account.account_name,    // pour affichage rapide côté client
          },
          { expiresIn: "7d" } // token valide 7 jours
        );

        return reply.code(201).send({
          message: "Compte créé avec succès !",
          token,
          account: {
            id: account.account_id,
            name: account.account_name,
            mail: account.mail,
          },
        });

      } catch (error) {
        // Pseudo ou email déjà pris → 409 Conflict
        if (error instanceof ConflictError) {
          return reply.code(409).send({ error: error.message });
        }
        // Erreur inattendue → on laisse Fastify gérer (500)
        throw error;
      }
    }
  );

  // ----------------------------------------------------------
  //  POST /auth/login — Se connecter
  // ----------------------------------------------------------
  fastify.post<{ Body: LoginBody }>(
    "/auth/login",
    { schema: loginSchema },
    async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      try {
        const account = await loginAccount(fastify.prisma, request.body);

        const token = fastify.jwt.sign(
          {
            sub: account.account_id,
            name: account.account_name,
          },
          { expiresIn: "7d" }
        );

        return reply.code(200).send({
          message: "Connexion réussie !",
          token,
          account: {
            id: account.account_id,
            name: account.account_name,
            mail: account.mail,
          },
        });

      } catch (error) {
        // Identifiants invalides → 401 Unauthorized
        if (error instanceof UnauthorizedError) {
          return reply.code(401).send({ error: error.message });
        }
        throw error;
      }
    }
  );

  // ----------------------------------------------------------
  //  GET /auth/me — Profil de l'utilisateur connecté (protégé)
  //  Exemple d'utilisation du token JWT pour protéger une route.
  // ----------------------------------------------------------
  fastify.get(
    "/auth/me",
    {
      onRequest: [fastify.authenticate], // middleware défini dans jwt.plugin.ts
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // request.user est typé grâce à la déclaration dans jwt.plugin.ts
      const payload = request.user as { sub: number; name: string };

      const account = await fastify.prisma.account.findUnique({
        where: { account_id: payload.sub },
        select: {
          account_id: true,
          account_name: true,
          mail: true,
          level: true,
          experience: true,
          xp_max: true,
          power: true,
          avatar: true,
          createdAt: true,
        },
      });

      if (!account) {
        return reply.code(404).send({ error: "Compte introuvable." });
      }

      return reply.send({ account });
    }
  );
}
