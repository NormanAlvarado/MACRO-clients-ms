import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Client } from '../entities/client.entity';

@ObjectType()
export class PaginatedClients {
  @Field(() => [Client])
  data: Client[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}
