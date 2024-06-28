// src/entity/Address.ts
import "reflect-metadata"

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './Customer';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    postalCode: string;

    @Column()
    country: string;

    @ManyToOne(() => Customer, customer => customer.addresses, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    customer: Customer;
}
