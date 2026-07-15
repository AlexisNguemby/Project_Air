import "dotenv/config"; // Charge les variables du fichier .env
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // Prisma 7 récupère l'URL de connexion MySQL ici !
  },
});