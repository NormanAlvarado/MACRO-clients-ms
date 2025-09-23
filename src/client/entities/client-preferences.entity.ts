import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@ObjectType()
@Entity('preferencias_cliente')
export class ClientPreferences {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  cliente_id: number;

  @Field()
  @Column({ type: 'varchar', length: 10, default: 'es' })
  idioma: string;

  @Field()
  @Column({ default: true })
  notificaciones_email: boolean;

  @Field()
  @Column({ default: false })
  notificaciones_push: boolean;

  @OneToOne(() => Client, client => client.preferences)
  @JoinColumn({ name: 'cliente_id' })
  client: Client;
}
