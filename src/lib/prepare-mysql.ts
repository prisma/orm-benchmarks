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
  // console.log(`Clearing tables ...`);

  // MySQL
  // await prisma.address.deleteMany();
  // await prisma.$executeRaw`ALTER TABLE Address AUTO_INCREMENT = 1;`;

  // await prisma.order.deleteMany();
  // await prisma.$executeRaw`ALTER TABLE Order AUTO_INCREMENT = 1;`;

  // await prisma.product.deleteMany();
  // await prisma.$executeRaw`ALTER TABLE Product AUTO_INCREMENT = 1;`;

  // await prisma.customer.deleteMany();
  // await prisma.$executeRaw`ALTER TABLE Customer AUTO_INCREMENT = 1;`;

  faker.seed(FAKER_SEED);

  console.log(`Seeding data ...`);

  // const customerData: Prisma.CustomerCreateInput[] = [];
  // const productDataArray: Prisma.ProductCreateInput[] = [];
  // const orderDataArray: Prisma.OrderCreateInput[] = [];
  // const addressDataArray: Prisma.AddressCreateInput[] = [];

  // Seed Customers
  console.log(`Customers with orders ...`);
  for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
    // const customerInput: Prisma.CustomerCreateInput = {
    //   name: faker.person.fullName(),
    //   email: faker.internet.email(),
    //   isActive: faker.datatype.boolean(),
    //   address: {
    //     create: {
    //       street: faker.location.streetAddress(),
    //       city: faker.location.city(),
    //       postalCode: faker.location.zipCode(),
    //       country: faker.location.country(),
    //     },
    //   },
    // };
    // customerData.push(customerInput);

    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        isActive: faker.datatype.boolean(),
        address: {
          create: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
          },
        },
      },
    });

    // Seed Orders for each Customer
    for (let j = 0; j < NUMBER_OF_RELATED_RECORDS; j++) {
      // const orderInput = {
      //   date: faker.date.past(),
      //   totalAmount: faker.number.int({ min: 10, max: 1000 }),
      //   customerId: i + 1,
      //   customer: {}
      // };
      // orderDataArray.push(orderInput);
      // }
      await prisma.order.create({
        data: {
          date: faker.date.past(),
          totalAmount: faker.number.int({ min: 10, max: 1000 }),
          customerId: customer.id,
        },
      });
    }
    // await prisma.customer.createMany({
    //   data: customerData
    // });


    // Seed Products
    console.log(`Products ...`);
    for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
      await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
          quantity: faker.number.int({ min: 1, max: 100 }),
          description: faker.commerce.productDescription(),
        },
      });
    }

    // Associate Products with Orders
    console.log(`Connect products with orders ...`);
    const orders = await prisma.order.findMany();
    const products = await prisma.product.findMany();

    for (const order of orders) {
      const randomProducts = faker.helpers.shuffle(products).slice(0, faker.number.int({ min: 1, max: 5 }));
      for (const product of randomProducts) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            products: {
              connect: { id: product.id },
            },
          },
        });
      }
    }

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
}

async function createSQLDumpMySQL(databaseUrl: string, filePath?: string) {
  const connectionDetails = extractConnectionDetailsFromUrl(databaseUrl);
  console.log(`Dumping dataset with connection details: `, connectionDetails);
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
