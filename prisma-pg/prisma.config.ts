import "dotenv/config";
import { defineConfig, env } from "prisma/config";

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  engine: "classic",
  datasource: {
    url: env<Env>("DATABASE_URL"),
  },
  schema: "./schema.prisma",
});
