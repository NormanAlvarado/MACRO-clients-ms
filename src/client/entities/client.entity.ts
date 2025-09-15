import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Client {
  @Field(() => ID, { description: 'ID único del cliente' })
  id: string;

  @Field({ description: 'Nombre del cliente' })
  nombre: string;

  @Field({ description: 'Email del cliente' })
  email: string;

  @Field({ description: 'Teléfono del cliente' })
  telefono: string;

  @Field({ description: 'Dirección del cliente' })
  direccion: string;

  @Field({ description: 'Fecha de registro del cliente' })
  fecha_registro: Date;

  @Field({ description: 'Indica si el cliente ha sido eliminado (soft delete)' })
  isDeleted: boolean;
}
