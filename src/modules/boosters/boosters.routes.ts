import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { openBooster } from "./boosters.service.js";

export default async function boosterRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/boosters/open",
    {
      onRequest: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as { sub: number; name: string };

      try {
        const result = await openBooster(fastify.prisma, payload.sub);

        return reply.code(200).send({
          message: "Booster ouvert avec succès !",
          booster_size: result.cards.length,
          collection_id: result.collection_id,
          cards: result.cards,
        });
      } catch (error) {
        if (error instanceof Error && error.message === "Collection introuvable.") {
          return reply.code(404).send({ error: error.message });
        }

        throw error;
      }
    }
  );
}