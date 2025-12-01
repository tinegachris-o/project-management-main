import 'dotenv/config';                // <- ensures process.env is loaded when you run `npx prisma ...`
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./schema.prisma",

  datasource: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
