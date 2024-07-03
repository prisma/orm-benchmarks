export type ORM = "prisma" | "drizzle" | "typeorm";
export type Database = "postgresql" | "mysql"
export type QueryResult = {
  query: string;
  time: number;
  data: any;
};
export type SingleBenchmarkRunResult = QueryResult[];
export type MultipleBenchmarkRunResults = SingleBenchmarkRunResult[];
export type AllResults = { [key in ORM]: MultipleBenchmarkRunResults };
