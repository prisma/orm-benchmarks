import { PrismaClient, Prisma } from "../prisma/client-mysql";
import { faker } from "@faker-js/faker";
import { executeCommand, extractConnectionDetailsFromUrl } from "./execute-command";
import { promises as fs } from 'fs';

export async function prepareMySQL(
  options: { databaseUrl: string, size: number, fakerSeed: number; }
) {

  const NUMBER_OF_RECORDS = options.size || 1000;
  const NUMBER_OF_RELATED_RECORDS = 10;
  const FAKER_SEED = options.fakerSeed || 42;

  const filePath = `./data/data-mysql-${NUMBER_OF_RECORDS}-${FAKER_SEED}.sql`;
  // TO INVESTIGATE:
  // -- SET @@SESSION.SQL_LOG_BIN= 0; this line at the top of the SQL dump seems to cause issues during the re-import
  if (await fileExists(filePath)) {
    console.log(`Use SQL dump: ${filePath}`);
    await restoreFromSQLDumpMySQL(options.databaseUrl, filePath);
    return;
  }

  console.log(`${filePath} doesn't exist yet, creating SQL dump ...`);


  const prisma = new PrismaClient({
    datasourceUrl: options.databaseUrl,
  });

  // console.log(`Preparing DB ...`, databaseUrl);

  // Clean tables
  console.log(`Clearing tables ...`);

  // MySQL
  await prisma.address.deleteMany();
  await prisma.$executeRaw`ALTER TABLE Address AUTO_INCREMENT = 1;`;

  await prisma.order.deleteMany();
  await prisma.$executeRaw`ALTER TABLE \`Order\` AUTO_INCREMENT = 1;`;

  await prisma.product.deleteMany();
  await prisma.$executeRaw`ALTER TABLE Product AUTO_INCREMENT = 1;`;

  await prisma.customer.deleteMany();
  await prisma.$executeRaw`ALTER TABLE Customer AUTO_INCREMENT = 1;`;

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
  await prisma.$queryRawUnsafe(`INSERT INTO _OrderProducts (A, B) VALUES ${input}`);


  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const addressesCount = await prisma.address.count();
  const customersCount = await prisma.customer.count();
  console.log(
    `Created the following records: \n${ordersCount} orders\n${productsCount} products\n${addressesCount} addresses\n${customersCount} customers`
  );


  await createSQLDumpMySQL(options.databaseUrl, filePath);

  await prisma.$disconnect();
}

async function createSQLDumpMySQL(databaseUrl: string, filePath?: string) {
  const connectionDetails = extractConnectionDetailsFromUrl(databaseUrl);
  console.log(`Dumping dataset with connection details: `, connectionDetails);
  if (!connectionDetails) {
    console.log(`Error while creating SQL dump. DB URL not valid.`);
    return;
  }
  const { host, user, db, password } = connectionDetails;
  const command = `mysqldump -h ${host} -u ${user} -p${password} -B ${db} --single-transaction --routines --triggers --verbose --result-file=${filePath}`;
  console.log(`SQL dump command: `, command);
  try {
    await executeCommand(command, { MYSQL_PWD: password });
    console.log(`Sucessfully stored SQL dump in ${filePath}`);
  } catch (error) {
    console.error("Failed to execute mysqldump command.");
    console.error(error);
  }
}

async function restoreFromSQLDumpMySQL(databaseUrl: string, filePath: string) {
  const connectionDetails = extractConnectionDetailsFromUrl(databaseUrl);
  console.log(`Restoring dataset with connection details: `, connectionDetails);
  if (!connectionDetails) {
    console.log(`Error while creating SQL dump. DB URL not valid.`);
    return;
  }
  const { host, user, db, password } = connectionDetails;
  const command = `mysql -h ${host} -u ${user} -p${password} ${db} < ${filePath}`;
  console.log(`SQL restore command: `, command);
  try {
    await executeCommand(command, { MYSQL_PWD: password });
    console.log(`Sucessfully restored SQL dump from ${filePath}`);
  } catch (error) {
    console.error("Failed to execute mysql command.");
    console.error(error);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
