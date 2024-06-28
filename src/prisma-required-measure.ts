import { PrismaClient, Prisma } from "@prisma/client";
import measure from "./lib/measure";

const prisma = new PrismaClient();

async function main() {
  /**
   * findMany
   */

  measure(prisma.customer.findMany());
  measure(
    prisma.customer.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
    })
  );
  measure(
    prisma.customer.findMany({
      include: {
        orders: true,
      },
    })
  );
  /**
   * findFirst
   */

  measure(prisma.customer.findFirst());
  measure(
    prisma.customer.findFirst({
      include: {
        orders: true,
      },
    })
  );
  /**
   * findFirstOrThrow
   */

  measure(prisma.customer.findFirstOrThrow());
  measure(
    prisma.customer.findFirstOrThrow({
      include: {
        orders: true,
      },
    })
  );
  /**
   * findUnique
   */

  measure(
    prisma.customer.findUnique({
      where: { id: 1 },
    })
  );
  measure(
    prisma.customer.findUnique({
      where: { id: 1 },
      include: {
        orders: true,
      },
    })
  );
  /**
   * findUniqueOrThrow
   */

  measure(
    prisma.customer.findUniqueOrThrow({
      where: { id: 1 },
    })
  );
  measure(
    prisma.customer.findUniqueOrThrow({
      where: { id: 1 },
      include: {
        orders: true,
      },
    })
  );
  /**
   * create
   */

  measure(
    prisma.customer.create({
      data: {
        name: "John Doe",
        email: new Date() + "@example.com",
      },
    })
  );
  measure(
    prisma.customer.create({
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
    })
  );
  /**
   * update
   */

  measure(
    prisma.customer.update({
      where: { id: 1 },
      data: {
        name: "John Doe Updated",
      },
    })
  );
  measure(
    prisma.customer.update({
      where: { id: 1 },
      data: {
        name: "John Doe Updated",
        address: {
          update: {
            street: "456 New St",
          },
        },
      },
    })
  );
  measure(
    prisma.customer.update({
      where: { id: 1 },
      data: {
        name: "John Doe Updated",
        address: {
          update: {
            street: "456 New St",
          },
        },
        orders: {
          update: {
            where: { id: 1 },
            data: {
              totalAmount: 200.0,
            },
          },
        },
      },
    })
  );
  /**
   * upsert
   */

  measure(
    prisma.customer.upsert({
      where: { id: 1 },
      update: {
        name: "John Doe Upserted",
      },
      create: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    })
  );
  measure(
    prisma.customer.upsert({
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
    })
  );
  measure(
    prisma.customer.upsert({
      where: { id: 1 },
      update: {
        name: "John Doe Upserted",
        orders: {
          upsert: {
            where: { id: 1 },
            update: {
              totalAmount: 200.0,
            },
            create: {
              date: new Date(),
              totalAmount: 100.5,
              products: {
                connect: [{ id: 1 }, { id: 2 }],
              },
            },
          },
        },
      },
      create: {
        name: "John Doe",
        email: "john.doe@example.com",
        orders: {
          create: {
            date: new Date(),
            totalAmount: 100.5,
            products: {
              connect: [{ id: 1 }, { id: 2 }],
            },
          },
        },
      },
    })
  );
  /**
   * delete
   */

  /**
   * createMany
   */

  const _customersToCreate: Prisma.CustomerCreateInput[] = [];

  for (let i = 0; i < 1000; i++) {
    _customersToCreate.push({
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
    });
  }

  measure(
    prisma.customer.createMany({
      data: _customersToCreate,
    })
  );
  /**
   * createManyAndReturn
   */

  measure(
    prisma.customer.createManyAndReturn({
      data: _customersToCreate,
    })
  );

  /**
   * updateMany
   */

  measure(
    prisma.customer.updateMany({
      where: { isActive: false },
      data: { isActive: true },
    })
  );
  /**
   * deleteMany
   */

  measure(
    prisma.customer.deleteMany({
      where: { isActive: false },
    })
  );

  /**
   * aggregate
   */

  measure(
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    })
  );

  /**
   * groupBy
   */

  measure(
    prisma.order.groupBy({
      by: ["customerId"],
      _sum: {
        totalAmount: true,
      },
      _count: {
        _all: true,
      },
    })
  );
}

main()
  .then(async () => {
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
