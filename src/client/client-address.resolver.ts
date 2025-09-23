import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientAddressService } from './client-address.service';
import { ClientAddress } from './entities/client-address.entity';
import { CreateClientAddressInput } from './dto/create-client-address.input';
import { UpdateClientAddressInput } from './dto/update-client-address.input';

@Resolver(() => ClientAddress)
export class ClientAddressResolver {
  constructor(private readonly clientAddressService: ClientAddressService) {}

  @Mutation(() => ClientAddress, { 
    name: 'createClientAddress',
    description: 'Crear una nueva dirección para un cliente'
  })
  createClientAddress(
    @Args('createClientAddressInput') createClientAddressInput: CreateClientAddressInput,
  ): Promise<ClientAddress> {
    return this.clientAddressService.create(createClientAddressInput);
  }

  @Query(() => [ClientAddress], { 
    name: 'clientAddresses',
    description: 'Obtener todas las direcciones de clientes'
  })
  findAll(): Promise<ClientAddress[]> {
    return this.clientAddressService.findAll();
  }

  @Query(() => [ClientAddress], { 
    name: 'clientAddressesByClient',
    description: 'Obtener todas las direcciones de un cliente específico'
  })
  findByClientId(
    @Args('clientId', { type: () => Int }) clientId: number,
  ): Promise<ClientAddress[]> {
    return this.clientAddressService.findByClientId(clientId);
  }

  @Query(() => ClientAddress, { 
    name: 'clientAddress',
    description: 'Obtener una dirección específica por su ID'
  })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ClientAddress> {
    return this.clientAddressService.findOne(id);
  }

  @Mutation(() => ClientAddress, { 
    name: 'updateClientAddress',
    description: 'Actualizar una dirección existente'
  })
  updateClientAddress(
    @Args('updateClientAddressInput') updateClientAddressInput: UpdateClientAddressInput,
  ): Promise<ClientAddress> {
    return this.clientAddressService.update(updateClientAddressInput.id, updateClientAddressInput);
  }

  @Mutation(() => ClientAddress, { 
    name: 'removeClientAddress',
    description: 'Eliminar una dirección (soft delete)'
  })
  removeClientAddress(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ClientAddress> {
    return this.clientAddressService.remove(id);
  }

  @Mutation(() => ClientAddress, { 
    name: 'setPrincipalAddress',
    description: 'Establecer una dirección como principal para el cliente'
  })
  setPrincipalAddress(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ClientAddress> {
    return this.clientAddressService.setPrincipal(id);
  }
}
