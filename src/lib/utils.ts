import { Database } from "./types";

export function extractDatabase(databaseUrl: string): Database {
  if (databaseUrl.startsWith("postgres")) {
    return "PostgreSQL";
  } else if (databaseUrl.startsWith("mysql")) {
    return "MySQL";
  }
  return "PostgreSQL";
}
