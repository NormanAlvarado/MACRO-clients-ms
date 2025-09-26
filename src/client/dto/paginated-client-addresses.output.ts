import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ClientAddress } from '../entities/client-address.entity';

@ObjectType()
export class PaginatedClientAddresses {
  @Field(() => [ClientAddress])
  data: ClientAddress[];

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

  @Field(() => Int)
  clientId: number;
}
