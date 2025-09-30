import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum HealthStatusEnum {
  OK = 'ok',
  ERROR = 'error',
}

export enum DbStatusEnum {
  UP = 'up',
  DOWN = 'down',
}

// Registrar los enums para GraphQL
registerEnumType(HealthStatusEnum, {
  name: 'HealthStatusEnum',
  description: 'Estado general del sistema',
});

registerEnumType(DbStatusEnum, {
  name: 'DbStatusEnum',
  description: 'Estado de la base de datos',
});

@ObjectType()
export class DbHealth {
  @Field(() => DbStatusEnum, { description: 'Estado de la base de datos' })
  dbStatus: DbStatusEnum;

  @Field({ description: 'Mensaje descriptivo del estado' })
  message: string;
}

@ObjectType()
export class ServiceHealth {
  @Field(() => DbHealth, { description: 'Estado de la base de datos' })
  database: DbHealth;
}

@ObjectType()
export class HealthStatus {
  @Field(() => HealthStatusEnum, { description: 'Estado general del sistema' })
  status: HealthStatusEnum;

  @Field({ description: 'Timestamp de la verificación' })
  timestamp: string;

  @Field(() => ServiceHealth, { description: 'Estado de los servicios' })
  services: ServiceHealth;
}