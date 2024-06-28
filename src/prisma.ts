import { PrismaClient } from "@prisma/client";
import prepare from "./lib/prepare"
import measure from "./lib/measure"

const prisma = new PrismaClient();

async function main() {

  await prepare();
    
  /**
   * findMany
   */

  await measure('prisma-findMany', prisma.customer.findMany());

  await measure('prisma-findMany-filter-paginate-order', prisma.customer.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: 0,
    take: 10,
  }));

  await measure('prisma-findMany-1-level-nesting', prisma.customer.findMany({
    include: {
      orders: true,
    },
  }));

  /**
   * findFirst
   */

  await measure('prisma-findFirst', prisma.customer.findFirst());

  await measure('prisma-findFirst-1-level-nesting', prisma.customer.findFirst({
    include: {
      orders: true,
    },
  }));

  /**
   * findUnique
   */

  await measure('prisma-findUnique', prisma.customer.findUnique({
    where: { id: 1 },
  }));

  await measure('prisma-findUnique-1-level-nesting', prisma.customer.findUnique({
    where: { id: 1 },
    include: {
      orders: true,
    },
  }));

  /**
   * create
   */

  await measure('prisma-create', prisma.customer.create({
    data: {
      name: "John Doe",
      email: new Date() + "@example.com",
    },
  }));

  await measure('prisma-nested-create', prisma.customer.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      orders: {
        create: {
          date: new Date(),
          totalAmount: 100.5,
          products: {
            connect: [{ id: 1 }, { id: 2 }], // Assuming products with IDs 1 and 2 already exist
          },
        },
      },
    },
  }));

  /**
   * update
   */

  await measure('prisma-update', prisma.customer.update({
    where: { id: 1 },
    data: {
      name: "John Doe Updated",
    },
  }));

  await measure('prisma-nested-update', prisma.customer.update({
    where: { id: 1 },
    data: {
      name: "John Doe Updated",
      address: {
        update: {
          street: "456 New St",
        },
      },
    },
  }));

  /**
   * upsert
   */

  await measure('prisma-upsert', prisma.customer.upsert({
    where: { id: 1 },
    update: {
      name: "John Doe Upserted",
    },
    create: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
  }));

  await measure('prisma-nested-upsert', prisma.customer.upsert({
    where: { id: 1 },
    update: {
      name: "John Doe Upserted",
      address: {
        update: {
          street: "456 New St",
        },
      },
    },
    create: {
      name: "John Doe",
      email: "john.doe@example.com",
      address: {
        create: {
          street: "123 Main St",
          city: "Anytown",
          postalCode: "12345",
          country: "Country",
        },
      },
    },
  }));

  /**
   * delete
   */

  await measure('prisma-delete', prisma.customer.delete({
    where: { id: 1 },
  }));

  // /**
  //  * createMany
  //  */

  // const _customersToCreate: Prisma.CustomerCreateInput[] = [];
    
  // for (let i = 0; i < 1000; i++) {
  //   _customersToCreate.push({
  //     name: `Customer ${i}`,
  //     email: `customer${i}@example.com`,
  //   });
  // }

  // await measure('prisma-createMany', prisma.customer.createMany({
  //   data: _customersToCreate,
  // }));

  // /**
  //  * createManyAndReturn
  //  */

  // await measure('prisma-createManyAndReturn', prisma.customer.createManyAndReturn({
  //   data: _customersToCreate,
  // }));

  // /**
  //  * updateMany
  //  */

  // await measure('prisma-updateMany', prisma.customer.updateMany({
  //   where: { isActive: false },
  //   data: { isActive: true },
  // }));

  // /**
  //  * deleteMany
  //  */

  // await measure('prisma-deleteMany', prisma.customer.deleteMany({
  //   where: { isActive: false },
  // }));

  // /**
  //  * aggregate
  //  */

  // await measure('prisma-aggregate', prisma.order.aggregate({
  //   _sum: {
  //     totalAmount: true,
  //   },
  // }));

  // /**
  //  * groupBy
  //  */

  // await measure('prisma-groupBy', prisma.order.groupBy({
  //   by: ["customerId"],
  //   _sum: {
  //     totalAmount: true,
  //   },
  //   _count: {
  //     _all: true,
  //   },
  // }));

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
