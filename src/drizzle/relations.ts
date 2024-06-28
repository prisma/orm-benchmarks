import { relations } from "drizzle-orm/relations";
import { Customer, Address, Order, Product, _OrderProducts } from "./schema";

export const AddressRelations = relations(Address, ({one}) => ({
	Customer: one(Customer, {
		fields: [Address.customerId],
		references: [Customer.id]
	}),
}));

export const CustomerRelations = relations(Customer, ({many}) => ({
	Addresses: many(Address),
	Orders: many(Order),
}));

export const OrderRelations = relations(Order, ({one, many}) => ({
	Customer: one(Customer, {
		fields: [Order.customerId],
		references: [Customer.id]
	}),
	_OrderProducts: many(_OrderProducts),
}));

export const _OrderProductsRelations = relations(_OrderProducts, ({one}) => ({
	Product: one(Product, {
		fields: [_OrderProducts.B],
		references: [Product.id]
	}),
	Order: one(Order, {
		fields: [_OrderProducts.A],
		references: [Order.id]
	}),
}));

export const ProductRelations = relations(Product, ({many}) => ({
	_OrderProducts: many(_OrderProducts),
}));