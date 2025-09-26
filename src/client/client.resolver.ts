import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { PaginationInput } from './dto/pagination.input';
import { PaginatedClients } from './dto/paginated-clients.output';
import { CurrentSession } from '../auth/guards/current.session.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enum/user-role.enum';
import { User } from '../auth/decorators/user.decorators';
import * as currentUserInterface from '../auth/interfaces/current-user.interface';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.MASTER)
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<Client> {
    return this.clientService.create(createClientInput);
  }

  @Query(() => [Client], { name: 'clients' })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.BASIC, Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async findAll(@User() user: currentUserInterface.CurrentUser): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => PaginatedClients, { name: 'clientsPaginated' })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.BASIC, Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async findAllPaginated(
    @Args('paginationInput', { nullable: true }) paginationInput: PaginationInput = {},
    @User() user: currentUserInterface.CurrentUser
  ): Promise<PaginatedClients> {
    return this.clientService.findAllPaginated(paginationInput);
  }

  @Query(() => Client, { name: 'client' })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.BASIC, Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Mutation(() => Client)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<Client> {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.MASTER)
  async removeClient(
    @Args('id', { type: () => Int }) id: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<Client> {
    return this.clientService.remove(id);
  }

  // Métodos adicionales para administración
  @Mutation(() => Client)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.MASTER)
  async restoreClient(
    @Args('id', { type: () => Int }) id: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<Client> {
    return this.clientService.restore(id);
  }

  @Query(() => [Client], { name: 'allClientsIncludingDeleted' })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.MASTER)
  async findAllIncludingDeleted(@User() user: currentUserInterface.CurrentUser): Promise<Client[]> {
    return this.clientService.findAllIncludingDeleted();
  }

  @Mutation(() => Boolean)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.MASTER)
  async permanentDeleteClient(
    @Args('id', { type: () => Int }) id: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<boolean> {
    return this.clientService.permanentDelete(id);
  }
}
