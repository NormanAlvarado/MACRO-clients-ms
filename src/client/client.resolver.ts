import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  async createClient(@Args('createClientInput') createClientInput: CreateClientInput): Promise<Client> {
    return this.clientService.create(createClientInput);
  }

  @Query(() => [Client], { name: 'clients' })
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => Client, { name: 'client' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Mutation(() => Client)
  async updateClient(@Args('updateClientInput') updateClientInput: UpdateClientInput): Promise<Client> {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client)
  async removeClient(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientService.remove(id);
  }

  // Métodos adicionales para administración
  @Mutation(() => Client)
  async restoreClient(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientService.restore(id);
  }

  @Query(() => [Client], { name: 'allClientsIncludingDeleted' })
  async findAllIncludingDeleted(): Promise<Client[]> {
    return this.clientService.findAllIncludingDeleted();
  }

  @Mutation(() => Boolean)
  async permanentDeleteClient(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.clientService.permanentDelete(id);
  }
}
