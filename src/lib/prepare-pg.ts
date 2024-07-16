import { PrismaClient } from "../prisma/client-pg";
import { faker } from "@faker-js/faker";
import { executeCommand, extractConnectionDetailsFromUrl } from "./execute-command";
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';

export async function preparePg(
  options: { databaseUrl: string, size: number, fakerSeed: number; }
) {

  const NUMBER_OF_RECORDS = options.size || 1000;
  const NUMBER_OF_RELATED_RECORDS = 10;
  const FAKER_SEED = options.fakerSeed || 42;

  const dataDir = path.join('.', 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log(`data directory didn't exist, created directory: ${dataDir}`);
  }


  // const filePath = `./data/data-pg-${NUMBER_OF_RECORDS}-${FAKER_SEED}.sql`;
  const filePath = path.join('./data', `/data-pg-${NUMBER_OF_RECORDS}-${FAKER_SEED}.sql`);
  if (await fileExists(filePath)) {
    console.log(`Use SQL dump: ${filePath}`);
    await restoreFromSQLDumpPg(options.databaseUrl, filePath);
    return;
  }

  console.log(`${filePath} doesn't exist yet, creating SQL dump ...`);

  const prisma = new PrismaClient({
    datasourceUrl: options.databaseUrl,
  });

  // console.log(`Preparing DB ...`, databaseUrl);

  // Clean tables
  console.log(`Clearing tables ...`);

  // Postgres
  await prisma.address.deleteMany();
  await prisma.$executeRaw`ALTER SEQUENCE "Address_id_seq" RESTART WITH 1`;

  await prisma.order.deleteMany();
  await prisma.$executeRaw`ALTER SEQUENCE "Order_id_seq" RESTART WITH 1`;

  await prisma.product.deleteMany();
  await prisma.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;

  await prisma.customer.deleteMany();
  await prisma.$executeRaw`ALTER SEQUENCE "Customer_id_seq" RESTART WITH 1`;


  faker.seed(FAKER_SEED);

  console.log(`Seeding data ...`);

  const customerData: any[] = [];
  const addressData: any[] = [];
  const productData: any[] = [];
  const orderData: any[] = [];

  for (let i = 0; i < NUMBER_OF_RECORDS; i++) {

    const customerRecord = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      isActive: faker.datatype.boolean()
    };
    customerData.push(customerRecord);

    const addressRecord = {
      street: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
      customerId: i + 1
    };
    addressData.push(addressRecord);

    const productRecord = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 100 }),
    };
    productData.push(productRecord);


    for (let j = 0; j < NUMBER_OF_RELATED_RECORDS; j++) {
      const orderRecord = {
        date: faker.date.anytime(),
        totalAmount: parseFloat(faker.commerce.price({ min: 100, max: 100000 })),
        customerId: i + 1,
      };
      orderData.push(orderRecord);
    }
  }

  await prisma.customer.createMany({
    data: customerData
  });

  await prisma.address.createMany({
    data: addressData
  });

  await prisma.product.createMany({
    data: productData
  });

  await prisma.order.createMany({
    data: orderData,
  });

  // const productIds = Array.from({ length: NUMBER_OF_RECORDS }, (_, index) => index + 1);
  const orderIds = Array.from({ length: NUMBER_OF_RECORDS * NUMBER_OF_RELATED_RECORDS }, (_, index) => index + 1);

  const values = orderIds.map(orderId => {
    const productId = faker.number.int({ min: 1, max: NUMBER_OF_RECORDS });
    return {
      A: orderId,
      B: productId
    };
  });

  function transformArrayToString(arr: { A: number; B: number; }[]): string {
    return arr.map(item => `(${item.A}, ${item.B})`).join(', ');
  }

  const input = transformArrayToString(values);
  await prisma.$queryRawUnsafe(`INSERT INTO "_OrderProducts" ("A", "B") VALUES ${input} ON CONFLICT ("A", "B") DO NOTHING`);

  const ordersCount: any = await prisma.$queryRaw`SELECT COUNT(*) FROM "Order"`;
  const productsCount: any = await prisma.$queryRaw`SELECT COUNT(*) FROM "Product"`;
  const addressesCount: any = await prisma.$queryRaw`SELECT COUNT(*) FROM "Address"`;
  const customersCount: any = await prisma.$queryRaw`SELECT COUNT(*) FROM "Customer"`;
  console.log(
    `Created the following records: \n${ordersCount[0].count} orders\n${productsCount[0].count} products\n${addressesCount[0].count} addresses\n${customersCount[0].count} customers`
  );

  await prisma.$disconnect();

  await createSQLDumpPg(options.databaseUrl, filePath);
}

async function createSQLDumpPg(databaseUrl: string, filePath?: string) {
  const connectionDetails = extractConnectionDetailsFromUrl(databaseUrl);
  if (!connectionDetails) {
    console.log(`Error while creating SQL dump. DB URL not valid.`);
    return;
  }
  // console.log(`Dumping dataset with connection details: `, connectionDetails);
  const { host, user, db, password } = connectionDetails;
  // const command = `pg_dump -h ${host} -U ${user} -d ${db} --no-owner -F c -b -v -f ${filePath}`;
  // Other options for Xata
  const command = `pg_dump -h ${host} -U ${user} -d ${db} --no-acl --no-owner --no-table-access-method -F c -b -v -f ${filePath}`;
  console.log(`SQL dump command: `, command);
  try {
    await executeCommand(command, { PGPASSWORD: password });
    console.log(`Sucessfully stored SQL dump in ${filePath}`);
  } catch (error) {
    console.error("Failed to execute pg_dump command.");
    console.error(error);
  }
}

async function restoreFromSQLDumpPg(databaseUrl: string, filePath: string) {
  const connectionDetails = extractConnectionDetailsFromUrl(databaseUrl);
  // console.log(`Restoring dataset with connection details: `, connectionDetails);
  if (!connectionDetails) {
    console.log(`Error while creating SQL dump. DB URL not valid.`);
    return;
  }
  const { host, user, db, password } = connectionDetails;
  const commandTruncate = `psql -h ${host} -U ${user} -d ${db} -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'`;
  console.log(`truncate command: `, commandTruncate);
  try {
    await executeCommand(commandTruncate, { PGPASSWORD: password });
    console.log("psql command executed successfully.");
  } catch (error) {
    console.error("Failed to execute psql command.");
  }
  const command = `pg_restore -h ${host} -U ${user} -d ${db} --no-owner -v ${filePath}`;
  console.log(`SQL restore command: `, command);
  try {
    await executeCommand(command, { PGPASSWORD: password });
    console.log(`Sucessfully restored SQL dump from ${filePath}`);
  } catch (error) {
    console.error("Failed to execute pg_restore command.");
    console.error(error);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
