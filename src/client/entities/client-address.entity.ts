import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Client } from './client.entity';

@Entity('direcciones_cliente')
@ObjectType()
@Index(['cliente_id', 'es_principal'], { unique: true, where: '"es_principal" = true' })
export class ClientAddress {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID único de la dirección' })
  id: number;

  @Column({ name: 'cliente_id' })
  @Field(() => Int, { description: 'ID del cliente' })
  cliente_id: number;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true, description: 'Nombre o alias de la sucursal/dirección' })
  nombre_sucursal?: string;

  @Column({ length: 200 })
  @Field({ description: 'Calle y número' })
  calle: string;

  @Column({ length: 100 })
  @Field({ description: 'Ciudad' })
  ciudad: string;

  @Column({ length: 100 })
  @Field({ description: 'Estado o provincia' })
  estado_provincia: string;

  @Column({ length: 20 })
  @Field({ description: 'Código postal' })
  codigo_postal: string;

  @Column({ length: 50, default: 'Costa Rica' })
  @Field({ description: 'País' })
  pais: string;

  @Column({ default: false })
  @Field({ description: 'Indica si es la dirección principal del cliente' })
  es_principal: boolean;

  @CreateDateColumn()
  @Field({ description: 'Fecha de creación de la dirección' })
  fecha_creacion: Date;

  @Column({ default: false })
  @Field({ description: 'Indica si la dirección ha sido eliminada (soft delete)' })
  is_deleted: boolean;

  // Relación Many-to-One con Client
  @ManyToOne(() => Client, client => client.addresses)
  @JoinColumn({ name: 'cliente_id' })
  @Field(() => Client, { description: 'Cliente propietario de esta dirección' })
  client: Client;
}
