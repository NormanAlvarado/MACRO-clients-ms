import { CreateClientPreferencesInput } from './create-client-preferences.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClientPreferencesInput extends PartialType(CreateClientPreferencesInput) {
  @Field(() => ID)
  id: string;
}
