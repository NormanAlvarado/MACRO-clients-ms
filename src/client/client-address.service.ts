import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ClientAddress } from './entities/client-address.entity';
import { CreateClientAddressInput } from './dto/create-client-address.input';
import { UpdateClientAddressInput } from './dto/update-client-address.input';

@Injectable()
export class ClientAddressService {
  constructor(
    @InjectRepository(ClientAddress)
    private readonly clientAddressRepository: Repository<ClientAddress>,
  ) {}

  async create(createClientAddressInput: CreateClientAddressInput): Promise<ClientAddress> {
    // Si se marca como principal, asegurarse de que no haya otra dirección principal para el mismo cliente
    if (createClientAddressInput.es_principal) {
      await this.unsetOtherPrincipalAddresses(createClientAddressInput.cliente_id);
    }

    const clientAddress = this.clientAddressRepository.create(createClientAddressInput);
    return await this.clientAddressRepository.save(clientAddress);
  }

  async findAll(): Promise<ClientAddress[]> {
    return await this.clientAddressRepository.find({
      where: { is_deleted: false },
      relations: ['client'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findByClientId(clientId: number): Promise<ClientAddress[]> {
    return await this.clientAddressRepository.find({
      where: { cliente_id: clientId, is_deleted: false },
      order: { es_principal: 'DESC', fecha_creacion: 'ASC' }
    });
  }

  async findOne(id: number): Promise<ClientAddress> {
    const clientAddress = await this.clientAddressRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['client']
    });

    if (!clientAddress) {
      throw new NotFoundException(`Dirección con ID ${id} no encontrada`);
    }

    return clientAddress;
  }

  async update(id: number, updateClientAddressInput: UpdateClientAddressInput): Promise<ClientAddress> {
    const clientAddress = await this.findOne(id);

    // Si se marca como principal, asegurarse de que no haya otra dirección principal para el mismo cliente
    if (updateClientAddressInput.es_principal && !clientAddress.es_principal) {
      await this.unsetOtherPrincipalAddresses(clientAddress.cliente_id);
    }

    Object.assign(clientAddress, updateClientAddressInput);
    return await this.clientAddressRepository.save(clientAddress);
  }

  async remove(id: number): Promise<ClientAddress> {
    const clientAddress = await this.findOne(id);
    
    // No permitir eliminar la dirección principal si es la única
    if (clientAddress.es_principal) {
      const otherAddresses = await this.clientAddressRepository.find({
        where: { cliente_id: clientAddress.cliente_id, is_deleted: false, id: Not(id) }
      });
      
      if (otherAddresses.length === 0) {
        throw new BadRequestException('No se puede eliminar la única dirección del cliente');
      }
    }

    clientAddress.is_deleted = true;
    return await this.clientAddressRepository.save(clientAddress);
  }

  async setPrincipal(id: number): Promise<ClientAddress> {
    const clientAddress = await this.findOne(id);
    
    await this.unsetOtherPrincipalAddresses(clientAddress.cliente_id);
    
    clientAddress.es_principal = true;
    return await this.clientAddressRepository.save(clientAddress);
  }

  private async unsetOtherPrincipalAddresses(clientId: number): Promise<void> {
    await this.clientAddressRepository.update(
      { cliente_id: clientId, es_principal: true, is_deleted: false },
      { es_principal: false }
    );
  }
}
