import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  collection: 'clientes',
  timestamps: { createdAt: 'fecha_registro', updatedAt: false }
})
@ObjectType()
export class Client extends Document {
  @Field(() => ID, { description: 'ID único del cliente' })
  declare _id: string;

  @Prop({ required: true, maxlength: 150 })
  @Field({ description: 'Nombre del cliente' })
  nombre: string;

  @Prop({ required: true, maxlength: 150, unique: true })
  @Field({ description: 'Email del cliente' })
  email: string;

  @Prop({ required: true, maxlength: 20 })
  @Field({ description: 'Teléfono del cliente' })
  telefono: string;

  @Prop({ required: true })
  @Field({ description: 'Dirección del cliente' })
  direccion: string;

  @Field({ description: 'Fecha de registro del cliente' })
  fecha_registro: Date;

  @Prop({ default: false })
  @Field({ description: 'Indica si el cliente ha sido eliminado (soft delete)' })
  isDeleted: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
