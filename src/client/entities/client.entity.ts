import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { ClientPreferences } from './client-preferences.entity';
import { ClientAddress } from './client-address.entity';

@Entity('clientes')
@ObjectType()
export class Client {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID único del cliente' })
  id: number;

  @Column({ length: 150 })
  @Field({ description: 'Nombre del cliente' })
  nombre: string;

  @Column({ length: 150, unique: true })
  @Field({ description: 'Email del cliente' })
  email: string;

  @Column({ length: 20 })
  @Field({ description: 'Teléfono del cliente' })
  telefono: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  @Field({ description: 'Fecha de registro del cliente' })
  fecha_registro: Date;

  @Column({ default: false, name: 'is_deleted' })
  @Field({ description: 'Indica si el cliente ha sido eliminado (soft delete)' })
  isDeleted: boolean;

  @OneToOne(() => ClientPreferences, preferences => preferences.client)
  @Field(() => ClientPreferences, { nullable: true, description: 'Preferencias del cliente' })
  preferences?: ClientPreferences;

  @OneToMany(() => ClientAddress, address => address.client)
  @Field(() => [ClientAddress], { description: 'Direcciones del cliente' })
  addresses: ClientAddress[];
}
