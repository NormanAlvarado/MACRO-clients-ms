import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';

@InputType()
export class CreateClientPreferencesInput {
  @Field(() => Int)
  @IsInt()
  cliente_id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  idioma?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  notificaciones_email?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  notificaciones_push?: boolean;
}
