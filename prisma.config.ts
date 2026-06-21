import "dotenv/config"; // 💡 Doit être la toute première ligne pour charger le fichier .env
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // C'est ici que Prisma 7 récupère l'URL maintenant !
  },
});