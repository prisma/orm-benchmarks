// // SQLite
// import { sqliteTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex, foreignKey, real, index } from "drizzle-orm/sqlite-core"

// import { sql } from "drizzle-orm"

// export const _prisma_migrations = sqliteTable("_prisma_migrations", {
// 	id: text("id").primaryKey().notNull(),
// 	checksum: text("checksum").notNull(),
// 	finished_at: numeric("finished_at"),
// 	migration_name: text("migration_name").notNull(),
// 	logs: text("logs"),
// 	rolled_back_at: numeric("rolled_back_at"),
// 	started_at: numeric("started_at").default(sql`(current_timestamp)`).notNull(),
// 	applied_steps_count: integer("applied_steps_count").default(0).notNull(),
// });

// export const Customer = sqliteTable("Customer", {
// 	id: numeric("id").primaryKey().notNull(),
// 	createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
// 	name: text("name"),
// 	email: text("email").notNull(),
// 	isActive: numeric("isActive").notNull(),
// });

// export const Address = sqliteTable("Address", {
// 	id: numeric("id").primaryKey().notNull(),
// 	street: text("street"),
// 	city: text("city"),
// 	postalCode: text("postalCode"),
// 	country: text("country"),
// 	customerId: numeric("customerId").notNull().references(() => Customer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// },
// (table) => {
// 	return {
// 		customerId_key: uniqueIndex("Address_customerId_key").on(table.customerId),
// 	}
// });

// export const Order = sqliteTable("Order", {
// 	id: numeric("id").primaryKey().notNull(),
// 	date: numeric("date").notNull(),
// 	totalAmount: numeric("totalAmount").notNull(),
// 	customerId: numeric("customerId").notNull().references(() => Customer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// });

// export const Product = sqliteTable("Product", {
// 	id: numeric("id").primaryKey().notNull(),
// 	name: text("name").notNull(),
// 	price: real("price").notNull(),
// 	quantity: integer("quantity").notNull(),
// 	description: text("description"),
// });

// export const _OrderProducts = sqliteTable("_OrderProducts", {
// 	A: integer("A").notNull().references(() => Order.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// 	B: integer("B").notNull().references(() => Product.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// },
// (table) => {
// 	return {
// 		B_idx: index('_OrderProducts_B').on(table.B),
// 		AB_unique: uniqueIndex("_OrderProducts_AB_unique").on(table.A, table.B),
// 	}
// });