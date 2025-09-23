import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) {}

  async create(createClientInput: CreateClientInput): Promise<Client> {
    const newClient = this.clientRepository.create({
      ...createClientInput,
      isDeleted: false,
    });

    return await this.clientRepository.save(newClient);
  }

  async findAll(): Promise<Client[]> {
    // Retorna solo los clientes que no han sido eliminados (soft delete)
    return await this.clientRepository.find({ 
      where: { isDeleted: false },
      relations: ['preferences', 'addresses']
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ 
      where: { id, isDeleted: false },
      relations: ['preferences', 'addresses']
    });
    
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return client;
  }

  async update(id: number, updateClientInput: UpdateClientInput): Promise<Client> {
    // Excluir el id del updateInput para evitar sobrescribirlo
    const { id: inputId, ...updateData } = updateClientInput;
    
    const client = await this.clientRepository.findOne({ 
      where: { id, isDeleted: false }
    });
    
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    Object.assign(client, updateData);
    return await this.clientRepository.save(client);
  }

  async remove(id: number): Promise<Client> {
    // Soft delete: marcar como eliminado en lugar de eliminar físicamente
    const client = await this.clientRepository.findOne({ 
      where: { id, isDeleted: false }
    });
    
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    client.isDeleted = true;
    return await this.clientRepository.save(client);
  }

  // Método adicional para restaurar un cliente eliminado
  async restore(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ 
      where: { id, isDeleted: true }
    });
    
    if (!client) {
      throw new NotFoundException(`Cliente eliminado con ID ${id} no encontrado`);
    }

    client.isDeleted = false;
    return await this.clientRepository.save(client);
  }

  // Método para obtener todos los clientes incluyendo los eliminados (para administración)
  async findAllIncludingDeleted(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  // Método para eliminar permanentemente un cliente (hard delete)
  async permanentDelete(id: number): Promise<boolean> {
    const result = await this.clientRepository.delete({ id });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return true;
  }
}
