export const prismaSnippets = {
  "prisma-findMany": `
prisma.customer.findMany()`,
  
  "prisma-findMany-filter-paginate-order": `
prisma.customer.findMany({
  where: { isActive: true },
  orderBy: { createdAt: "desc" },
  skip: 0,
  take: 10,
})`,
  
  "prisma-findMany-1-level-nesting": `
prisma.customer.findMany({
  include: {
    orders: true,
  },
})`,
  
  "prisma-findFirst": `
prisma.customer.findFirst()`,
  
  "prisma-findFirst-1-level-nesting": `
prisma.customer.findFirst({
  include: {
    orders: true,
  },
})`,
  
  "prisma-findUnique": `
prisma.customer.findUnique({
  where: { id: 1 },
})`,
  
  "prisma-findUnique-1-level-nesting": `
prisma.customer.findUnique({
  where: { id: 1 },
  include: {
    orders: true,
  },
})`,
  
  "prisma-create": `
prisma.customer.create({
  data: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
})`,
  
  "prisma-nested-create": `
prisma.customer.create({
  data: {
    name: "John Doe",
    email: "john.doe@example.com",
    isActive: false,
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
})`,
  
  "prisma-update": `
prisma.customer.update({
  where: { id: 1 },
  data: {
    name: "John Doe Updated",
  },
})`,
  
  "prisma-nested-update": `
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
})`,
  
  "prisma-upsert": `
prisma.customer.upsert({
  where: { id: 1 },
  update: {
    name: "John Doe Upserted",
  },
  create: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
})`,
  
  "prisma-nested-upsert": `
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
        street: "456 New St",
        city: "Anytown",
        postalCode: "12345",
        country: "Country",
      },
    },
  },
})`,
  
  "prisma-delete": `
prisma.customer.delete({
  where: { id: 1 },
})`,
};
