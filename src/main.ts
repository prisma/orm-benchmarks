import writeResults from "./lib/write-results";
import prepare from "./lib/prepare";
import { prismaPg } from "./prisma-postgres";
import { typeormPg } from "./typeorm-postgres";
import { drizzlePg } from "./drizzle-postgres";
import * as fs from 'fs';

async function runBenchmarks() {
  await prepare();
  console.log(`db ready`);
  const prismaResults = await prismaPg();

  await prepare();
  const drizzleResults = await drizzlePg();

  await prepare();
  const typeormResults = await typeormPg();

  const arrays: any = { prisma: prismaResults, drizzle: drizzleResults, typeorm: typeormResults };

  const header = [""].concat(prismaResults.map((item) => item.query));
  const rows = [];

  for (const key in arrays) {
    const row = [key].concat(arrays[key].map((item: { time: any; }) => item.time));
    rows.push(row);
  }

  const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
  console.log(csvContent)

  fs.writeFileSync(`./results/${new Date()}.csv`, csvContent);
}

runBenchmarks();
