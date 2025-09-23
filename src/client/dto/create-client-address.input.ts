import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';

@InputType()
export class CreateClientAddressInput {
  @Field(() => Int, { description: 'ID del cliente' })
  @IsInt()
  @Min(1)
  cliente_id: number;

  @Field({ nullable: true, description: 'Nombre o alias de la sucursal/dirección' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre_sucursal?: string;

  @Field({ description: 'Calle y número' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  calle: string;

  @Field({ description: 'Ciudad' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  ciudad: string;

  @Field({ description: 'Estado o provincia' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  estado_provincia: string;

  @Field({ description: 'Código postal' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo_postal: string;

  @Field({ description: 'País', defaultValue: 'Costa Rica' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pais?: string = 'Costa Rica';

  @Field({ description: 'Indica si es la dirección principal', defaultValue: false })
  @IsOptional()
  @IsBoolean()
  es_principal?: boolean = false;
}
