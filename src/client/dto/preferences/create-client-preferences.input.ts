import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, MaxLength, IsIn } from 'class-validator';

@InputType()
export class CreateClientPreferencesInput {
  @Field()
  @IsString()
  clienteId: string;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  notificaciones_email?: boolean = true;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  notificaciones_push?: boolean = false;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  notificaciones_sms?: boolean = true;

  @Field({ defaultValue: 'es' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @IsIn(['es', 'en', 'fr', 'de', 'it', 'pt'])
  idioma_preferido?: string = 'es';

  @Field({ defaultValue: 'EUR' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsIn(['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'])
  moneda_preferida?: string = 'EUR';

  @Field({ defaultValue: 'light' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsIn(['light', 'dark', 'auto'])
  tema_interfaz?: string = 'light';

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categorias_interes?: string;

  @Field({ defaultValue: 'email' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsIn(['email', 'telefono', 'sms', 'push'])
  metodo_contacto_preferido?: string = 'email';

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  marketing_emails?: boolean = true;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  compartir_datos?: boolean = false;
}
