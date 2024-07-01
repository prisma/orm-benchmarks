import writeResults from './lib/write-results';
import prepare from './lib/prepare';
import { prismaPg }  from './prisma-postgres'
import { typeormPg }  from './typeorm-postgres'
import { drizzlePg } from './drizzle-postgres';

async function runBenchmarks() {
  await prepare()
  console.log(`db ready`)
  const prismaResults = await prismaPg()

  await prepare()
  const drizzleResults = await drizzlePg()

  await prepare()
  const typeormResults = await typeormPg()

  writeResults('prisma', prismaResults)
  writeResults('drizzle', drizzleResults)
  writeResults('typeorm', typeormResults)
}

runBenchmarks()