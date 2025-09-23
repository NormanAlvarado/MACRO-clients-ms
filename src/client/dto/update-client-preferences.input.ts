import { CreateClientPreferencesInput } from './create-client-preferences.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClientPreferencesInput extends PartialType(CreateClientPreferencesInput) {
  @Field(() => Int)
  id: number;
}
