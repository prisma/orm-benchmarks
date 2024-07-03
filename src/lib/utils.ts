import { Database } from "./types";

export function extractDatabase(databaseUrl: string): Database {
  if (databaseUrl.startsWith("postgres")) {
    return "postgresql";
  } else if (databaseUrl.startsWith("mysql")) {
    return "mysql";
  }
  return "postgresql";
}
