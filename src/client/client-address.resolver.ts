import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientAddressService } from './client-address.service';
import { ClientAddress } from './entities/client-address.entity';
import { CreateClientAddressInput } from './dto/create-client-address.input';
import { UpdateClientAddressInput } from './dto/update-client-address.input';
import { PaginationInput } from './dto/pagination.input';
import { PaginatedClientAddresses } from './dto/paginated-client-addresses.output';
import { UseGuards } from '@nestjs/common';
import { CurrentSession } from 'src/auth/guards/current.session.guard';
import { User } from 'src/auth/decorators/user.decorators';

@Resolver(() => ClientAddress)
export class ClientAddressResolver {
  constructor(private readonly clientAddressService: ClientAddressService) {}

  @Mutation(() => ClientAddress, { 
    name: 'createClientAddress',
    description: 'Crear una nueva dirección para un cliente'
  })
  @UseGuards(CurrentSession)
  createClientAddress(
    @Args('createClientAddressInput') createClientAddressInput: CreateClientAddressInput,
    @User() user: any,
  ): Promise<ClientAddress> {
    return this.clientAddressService.create(createClientAddressInput);
  }

  @Query(() => [ClientAddress], { 
    name: 'clientAddresses',
    description: 'Obtener todas las direcciones de clientes'
  })
  @UseGuards(CurrentSession)
  findAll(@User() user: any): Promise<ClientAddress[]> {
    console.table(user);
    return this.clientAddressService.findAll();
  }

  @Query(() => [ClientAddress], { 
    name: 'clientAddressesByClient',
    description: 'Obtener todas las direcciones de un cliente específico'
  })
  @UseGuards(CurrentSession)
  findByClientId(
    @Args('clientId', { type: () => Int }) clientId: number,
    @User() user: any,
  ): Promise<ClientAddress[]> {
    return this.clientAddressService.findByClientId(clientId);
  }

  @Query(() => PaginatedClientAddresses, { 
    name: 'clientAddressesByClientPaginated',
    description: 'Obtener las direcciones de un cliente específico con paginación'
  })
  @UseGuards(CurrentSession)
  findByClientIdPaginated(
    @Args('clientId', { type: () => Int }) clientId: number,
    @Args('paginationInput', { nullable: true }) paginationInput: PaginationInput = {},
    @User() user: any,
  ): Promise<PaginatedClientAddresses> {
    return this.clientAddressService.findByClientIdPaginated(clientId, paginationInput);
  }

  @Query(() => ClientAddress, { 
    name: 'clientAddress',
    description: 'Obtener una dirección específica por su ID'
  })
  @UseGuards(CurrentSession)
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @User() user: any,
  ): Promise<ClientAddress> {
    return this.clientAddressService.findOne(id);
  }

  @Mutation(() => ClientAddress, { 
    name: 'updateClientAddress',
    description: 'Actualizar una dirección existente'
  })
  @UseGuards(CurrentSession)
  updateClientAddress(
    @Args('updateClientAddressInput') updateClientAddressInput: UpdateClientAddressInput,
    @User() user: any,
  ): Promise<ClientAddress> {
    return this.clientAddressService.update(updateClientAddressInput.id, updateClientAddressInput);
  }

  @Mutation(() => ClientAddress, { 
    name: 'removeClientAddress',
    description: 'Eliminar una dirección (soft delete)'
  })
  @UseGuards(CurrentSession)
  removeClientAddress(
    @Args('id', { type: () => Int }) id: number,
    @User() user: any,
  ): Promise<ClientAddress> {
    return this.clientAddressService.remove(id);
  }

  @Mutation(() => ClientAddress, { 
    name: 'setPrincipalAddress',
    description: 'Establecer una dirección como principal para el cliente'
  })
  @UseGuards(CurrentSession)
  setPrincipalAddress(
    @Args('id', { type: () => Int }) id: number,
    @User() user: any,
  ): Promise<ClientAddress> {
    return this.clientAddressService.setPrincipal(id);
  }
}
