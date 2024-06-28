// src/entity/Customer.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';
import { Address } from './Address';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    name: string;

    @Column()
    email: string;

    @Column({ default: false })
    isActive: boolean;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];

    @OneToMany(() => Address, address => address.customer)
    addresses: Address[];
}
