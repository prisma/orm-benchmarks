// SQLite
// import { pgTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex, foreignKey, real, index } from "drizzle-orm/sqlite-core"

// PostgreSQL
import { pgTable, boolean, text, numeric, serial, integer, uniqueIndex, foreignKey, real, index, date } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"

export const _prisma_migrations = pgTable("_prisma_migrations", {
	id: text("id").primaryKey().notNull(),
	checksum: text("checksum").notNull(),
	finished_at: numeric("finished_at"),
	migration_name: text("migration_name").notNull(),
	logs: text("logs"),
	rolled_back_at: numeric("rolled_back_at"),
	started_at: numeric("started_at").default(sql`(current_timestamp)`).notNull(),
	applied_steps_count: integer("applied_steps_count").default(0).notNull(),
});

export const Customer = pgTable("Customer", {
	id: serial("id").primaryKey().notNull(),
	createdAt: date("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	name: text("name"),
	email: text("email").notNull(),
	isActive: boolean("isActive").notNull(),
});

export const Address = pgTable("Address", {
	id: serial("id").primaryKey().notNull(),
	street: text("street"),
	city: text("city"),
	postalCode: text("postalCode"),
	country: text("country"),
	customerId: serial("customerId").notNull().references(() => Customer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		customerId_key: uniqueIndex("Address_customerId_key").on(table.customerId),
	}
});

export const Order = pgTable("Order", {
	id: serial("id").primaryKey().notNull(),
	date: date("date").notNull(),
	totalAmount: numeric("totalAmount").notNull(),
	customerId: serial("customerId").notNull().references(() => Customer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const Product = pgTable("Product", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	price: real("price").notNull(),
	quantity: integer("quantity").notNull(),
	description: text("description"),
});

export const _OrderProducts = pgTable("_OrderProducts", {
	A: integer("A").notNull().references(() => Order.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: integer("B").notNull().references(() => Product.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index('_OrderProducts_B').on(table.B),
		AB_unique: uniqueIndex("_OrderProducts_AB_unique").on(table.A, table.B),
	}
});