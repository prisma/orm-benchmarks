import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    
  /**
   * findMany
   */

  console.time('prisma-findMany')
  const _customers = await prisma.customer.findMany();
  console.timeEnd('prisma-findMany')

  console.time('prisma-findMany-filter-paginate-order')
  const _customersWithOptions = await prisma.customer.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: 0,
    take: 10,
  });
  console.timeEnd('prisma-findMany-filter-paginate-order')

  console.time('prisma-findMany-1-level-nesting')
  const _customersWithOrders = await prisma.customer.findMany({
    include: {
      orders: true,
    },
  });
  console.timeEnd('prisma-findMany-1-level-nesting')

  console.time('prisma-findMany-2-level-nesting')
  const _customersWithOrdersAndProducts = await prisma.customer.findMany({
    include: {
      orders: {
        include: {
          products: true,
        },
      },
    },
  })
  console.timeEnd('prisma-findMany-2-level-nesting')

  console.time('prisma-findMany-relation-filters');
  const _customersWithLargeOrders = await prisma.customer.findMany({
    include: {
      orders: {
        where: {
          totalAmount: {
            gt: 100,
          },
        },
      },
    },
  });
  console.timeEnd('prisma-findMany-relation-filters')

  /**
   * findFirst
   */

  console.time('prisma')
  const _firstCustomer = await prisma.customer.findFirst();
  console.timeEnd('prisma')

  console.time('prisma')
  const _firstCustomerWithOrders = await prisma.customer.findFirst({
    include: {
      orders: true,
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _firstCustomerWithOrdersAndProducts = await prisma.customer.findFirst({
    include: {
      orders: {
        include: {
          products: true,
        },
      },
    },
    
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _customerWithLargeOrders = await prisma.customer.findFirst({
    include: {
      orders: {
        where: {
          totalAmount: {
            gt: 100,
          },
        },
      },
    },
  });
  console.timeEnd('prisma')

  /**
   * findFirstOrThrow
   */

  console.time('prisma')
  const _firstCustomerOrThrow = await prisma.customer.findFirstOrThrow();
  console.timeEnd('prisma')

  console.time('prisma')
  const _firstCustomerThrowWithOrders = await prisma.customer.findFirstOrThrow({
    include: {
      orders: true,
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _firstCustomerThrowWithOrdersAndProducts = await prisma.customer.findFirstOrThrow({
    include: {
      orders: {
        include: {
          products: true,
        },
      },
    },
    
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _customerOrThrowWithLargeOrders = await prisma.customer.findFirstOrThrow({
    include: {
      orders: {
        where: {
          totalAmount: {
            gt: 100,
          },
        },
      },
    },
  });
  console.timeEnd('prisma')

  /**
   * findUnique
   */

  console.time('prisma')
  const _uniqueCustomer = await prisma.customer.findUnique({
    where: { id: 1 },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _uniqueCustomerWithOrders = await prisma.customer.findUnique({
    where: { id: 1 },
    include: {
      orders: true,
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _uniqueCustomerWithOrdersAndProducts = await prisma.customer.findUnique({
    where: { id: 1 },
    include: {
      orders: {
        include: {
          products: true,
        },
      },
    },
    
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _uniqueCustomerWithLargeOrders = await prisma.customer.findUnique({
    where: { id: 1 },
    include: {
      orders: {
        where: {
          totalAmount: {
            gt: 100,
          },
        },
      },
    },
  });
  console.timeEnd('prisma')

  /**
   * findUniqueOrThrow
   */

  console.time('prisma')
  const _uniqueOrThrowCustomer = await prisma.customer.findUniqueOrThrow({
    where: { id: 1 },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _uniqueOrThrowCustomerWithOrders = await prisma.customer.findUniqueOrThrow({
    where: { id: 1 },
    include: {
      orders: true,
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _uniqueOrThrowCustomerWithOrdersAndProducts = await prisma.customer.findUniqueOrThrow({
    where: { id: 1 },
    include: {
      orders: {
        include: {
          products: true,
        },
      },
    },
    
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _uniqueOrThrowWithLargeOrders = await prisma.customer.findUniqueOrThrow({
    where: { id: 1 },
    include: {
      orders: {
        where: {
          totalAmount: {
            gt: 100,
          },
        },
      },
    },
  });
  console.timeEnd('prisma')

  /**
   * create
   */

  console.time('prisma')
  const _newCustomer = await prisma.customer.create({
    data: {
      name: "John Doe",
      email: new Date() + "@example.com",
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _newCustomerWithOrder = await prisma.customer.create({
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
  });
  console.timeEnd('prisma')

  /**
   * update
   */

  console.time('prisma')
  const _updatedCustomer = await prisma.customer.update({
    where: { id: 1 },
    data: {
      name: "John Doe Updated",
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _updatedCustomerWithAddress = await prisma.customer.update({
    where: { id: 1 },
    data: {
      name: "John Doe Updated",
      address: {
        update: {
          street: "456 New St",
        },
      },
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _updatedCustomerWithOrder = await prisma.customer.update({
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
  });
  console.timeEnd('prisma')

  /**
   * upsert
   */

  console.time('prisma')
  const _upsertedCustomer = await prisma.customer.upsert({
    where: { id: 1 },
    update: {
      name: "John Doe Upserted",
    },
    create: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _upsertedCustomerWithAddress = await prisma.customer.upsert({
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
  });
  console.timeEnd('prisma')

  console.time('prisma')
  const _upsertedCustomerWithOrder = await prisma.customer.upsert({
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
  });
  console.timeEnd('prisma')

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

  console.time('prisma')
  const _createdCustomersCount = await prisma.customer.createMany({
    data: _customersToCreate,
  });
  console.timeEnd('prisma')

  /**
   * createManyAndReturn
   */

  console.time('prisma')
  const _createdCustomers = await prisma.customer.createManyAndReturn({
    data: _customersToCreate,
  });
  console.timeEnd('prisma')

  /**
   * updateMany
   */

  console.time('prisma')
  const _updatedCustomers = await prisma.customer.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  });
  console.timeEnd('prisma')

  /**
   * deleteMany
   */

  console.time('prisma')
  const _deletedCustomers = await prisma.customer.deleteMany({
    where: { isActive: false },
  });
  console.timeEnd('prisma')

    
  /**
   * aggregate
   */

  console.time('prisma')
  const _totalSales = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });
  console.timeEnd('prisma')

    
  /**
   * groupBy
   */

  console.time('prisma')
  const _salesByCustomer = await prisma.order.groupBy({
    by: ["customerId"],
    _sum: {
      totalAmount: true,
    },
    _count: {
      _all: true,
    },
  });
  console.timeEnd('prisma')


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