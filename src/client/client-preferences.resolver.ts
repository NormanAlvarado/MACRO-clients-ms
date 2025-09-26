import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ClientPreferencesService } from './client-preferences.service';
import { ClientPreferences } from './entities/client-preferences.entity';
import { CreateClientPreferencesInput } from './dto/create-client-preferences.input';
import { UpdateClientPreferencesInput } from './dto/update-client-preferences.input';
import { CurrentSession } from '../auth/guards/current.session.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enum/user-role.enum';
import { User } from '../auth/decorators/user.decorators';
import * as currentUserInterface from '../auth/interfaces/current-user.interface';

@Resolver(() => ClientPreferences)
export class ClientPreferencesResolver {
  constructor(private readonly preferencesService: ClientPreferencesService) {}

  @Mutation(() => ClientPreferences)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async createClientPreferences(
    @Args('createClientPreferencesInput') createClientPreferencesInput: CreateClientPreferencesInput,
    @User() user: currentUserInterface.CurrentUser,
  ): Promise<ClientPreferences> {
    return this.preferencesService.create(createClientPreferencesInput);
  }

  @Query(() => [ClientPreferences], { name: 'clientPreferences' })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.BASIC, Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async findAll(@User() user: currentUserInterface.CurrentUser): Promise<ClientPreferences[]> {
    return this.preferencesService.findAll();
  }

  @Query(() => ClientPreferences, { name: 'clientPreference' })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.BASIC, Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<ClientPreferences> {
    return this.preferencesService.findOne(id);
  }

  @Query(() => ClientPreferences, { name: 'clientPreferencesByClientId', nullable: true })
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.BASIC, Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async findByClientId(
    @Args('clientId', { type: () => Int }) clientId: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<ClientPreferences | null> {
    return this.preferencesService.findByClientId(clientId);
  }

  @Mutation(() => ClientPreferences)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.COLABORATOR, Role.MODERATOR, Role.MASTER)
  async updateClientPreferences(
    @Args('updateClientPreferencesInput') updateClientPreferencesInput: UpdateClientPreferencesInput,
    @User() user: currentUserInterface.CurrentUser,
  ): Promise<ClientPreferences> {
    return this.preferencesService.update(updateClientPreferencesInput.id, updateClientPreferencesInput);
  }

  @Mutation(() => ClientPreferences)
  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.MASTER)
  async removeClientPreferences(
    @Args('id', { type: () => Int }) id: number,
    @User() user: currentUserInterface.CurrentUser
  ): Promise<ClientPreferences> {
    return this.preferencesService.remove(id);
  }
}
