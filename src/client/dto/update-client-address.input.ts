import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { CreateClientAddressInput } from './create-client-address.input';

@InputType()
export class UpdateClientAddressInput extends PartialType(CreateClientAddressInput) {
  @Field(() => Int, { description: 'ID de la dirección a actualizar' })
  id: number;

  @Field({ nullable: true, description: 'Nombre o alias de la sucursal/dirección' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre_sucursal?: string;

  @Field({ nullable: true, description: 'Calle y número' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  calle?: string;

  @Field({ nullable: true, description: 'Ciudad' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @Field({ nullable: true, description: 'Estado o provincia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  estado_provincia?: string;

  @Field({ nullable: true, description: 'Código postal' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  codigo_postal?: string;

  @Field({ nullable: true, description: 'País' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pais?: string;

  @Field({ nullable: true, description: 'Indica si es la dirección principal' })
  @IsOptional()
  @IsBoolean()
  es_principal?: boolean;
}
