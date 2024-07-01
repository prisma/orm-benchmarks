import * as fs from 'fs';


type ORM = "prisma" | "drizzle" | "typeorm"

// const data = [
//   { query: 'prisma-findMany', time: 11.033344984054565 },
//   {
//     query: 'prisma-findMany-filter-paginate-order',
//     time: 2.823575973510742
//   },
//   {
//     query: 'prisma-findMany-1-level-nesting',
//     time: 21.985508978366852
//   },
//   { query: 'prisma-findFirst', time: 1.2392020225524902 },
//   {
//     query: 'prisma-findFirst-1-level-nesting',
//     time: 2.1000449657440186
//   },
//   { query: 'prisma-findUnique', time: 1.8836159706115723 },
//   {
//     query: 'prisma-findUnique-1-level-nesting',
//     time: 1.866392970085144
//   },
//   { query: 'prisma-create', time: 2.906828999519348 },
//   { query: 'prisma-nested-create', time: 9.255650997161865 },
//   { query: 'prisma-update', time: 2.4692919850349426 },
//   { query: 'prisma-nested-update', time: 5.512618005275726 },
//   { query: 'prisma-upsert', time: 4.3184579610824585 },
//   { query: 'prisma-nested-upsert', time: 5.220708966255188 },
//   { query: 'prisma-delete', time: 5.271791994571686 }
// ]

export default async function (orm: ORM, results: { query: string; time: number }[]) {
  console.log(`writing results for ${orm}:\n`, results);
  // console.log(`writing results for ${orm} ...`);

  try {
    fs.writeFileSync(`${orm}-results.csv`, results.toString(), 'utf8');
    console.log('File has been written successfully');
  } catch (err) {
    console.error('Error writing to file', err);
  }

}

function convertToCSV(results: { query: string; time: number }[]): string {
  const SEMICOLON = ";"
  const NEW_LINE = "\n"

  let csv = ""

  for (let result in results) {

  }

  return ""
}