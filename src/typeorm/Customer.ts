// src/entity/Customer.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';
import { Address } from './Address';

@Entity("Customer")
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    // sqlite
    // @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    // postgres
    @Column({ name: "createdAt", type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ nullable: true })
    name: string;

    @Column()
    email: string;

    @Column({ name: "isActive", default: false })
    isActive: boolean;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];

    @OneToMany(() => Address, address => address.customer)
    addresses: Address[];
}
