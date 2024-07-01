
type ORM = "prisma" | "drizzle" | "typeorm"

export default async function (orm: ORM, results: { query: string; time: number }[]) {
  console.log(`results for ${orm}:\n`, results);
}

