import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientPreferencesService } from './client-preferences.service';
import { ClientPreferences } from './entities/client-preferences.entity';
import { CreateClientPreferencesInput } from './dto/create-client-preferences.input';
import { UpdateClientPreferencesInput } from './dto/update-client-preferences.input';

@Resolver(() => ClientPreferences)
export class ClientPreferencesResolver {
  constructor(private readonly preferencesService: ClientPreferencesService) {}

  @Mutation(() => ClientPreferences)
  async createClientPreferences(
    @Args('createClientPreferencesInput') createClientPreferencesInput: CreateClientPreferencesInput,
  ): Promise<ClientPreferences> {
    return this.preferencesService.create(createClientPreferencesInput);
  }

  @Query(() => [ClientPreferences], { name: 'clientPreferences' })
  async findAll(): Promise<ClientPreferences[]> {
    return this.preferencesService.findAll();
  }

  @Query(() => ClientPreferences, { name: 'clientPreference' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<ClientPreferences> {
    return this.preferencesService.findOne(id);
  }

  @Query(() => ClientPreferences, { name: 'clientPreferencesByClientId', nullable: true })
  async findByClientId(@Args('clientId', { type: () => Int }) clientId: number): Promise<ClientPreferences | null> {
    return this.preferencesService.findByClientId(clientId);
  }

  @Mutation(() => ClientPreferences)
  async updateClientPreferences(
    @Args('updateClientPreferencesInput') updateClientPreferencesInput: UpdateClientPreferencesInput,
  ): Promise<ClientPreferences> {
    return this.preferencesService.update(updateClientPreferencesInput.id, updateClientPreferencesInput);
  }

  @Mutation(() => ClientPreferences)
  async removeClientPreferences(@Args('id', { type: () => Int }) id: number): Promise<ClientPreferences> {
    return this.preferencesService.remove(id);
  }
}
