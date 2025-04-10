export type ORM = "prisma" | "drizzle" | "drizzle-select" | "typeorm";
export type Database = "postgresql" | "mysql";
export type QueryResult = {
  query: string;
  time: number;
  data: any;
};
export type SingleBenchmarkRunResult = QueryResult[];
export type MultipleBenchmarkRunResults = SingleBenchmarkRunResult[];
export type AllResults = { [key in ORM]: MultipleBenchmarkRunResults };

export type ConnectionDetails = {
  user: string;
  password: string;
  host: string;
  port?: string;
  db: string;
};

export type BenchmarkOptions = {
  databaseUrl: string; 
  iterations: number;
  size: number;
  fakerSeed: number;
};