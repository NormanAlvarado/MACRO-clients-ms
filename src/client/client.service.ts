import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Client } from './entities/client.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientService {
  private clients: Client[] = []; // Simulando una base de datos en memoria

  create(createClientInput: CreateClientInput): Client {
    const newClient: Client = {
      id: uuidv4(),
      ...createClientInput,
      fecha_registro: new Date(),
      isDeleted: false,
    };

    this.clients.push(newClient);
    return newClient;
  }

  findAll(): Client[] {
    // Retorna solo los clientes que no han sido eliminados (soft delete)
    return this.clients.filter(client => !client.isDeleted);
  }

  findOne(id: string): Client {
    const client = this.clients.find(client => client.id === id && !client.isDeleted);
    
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return client;
  }

  update(id: string, updateClientInput: UpdateClientInput): Client {
    const clientIndex = this.clients.findIndex(client => client.id === id && !client.isDeleted);
    
    if (clientIndex === -1) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // Excluir el id del updateInput para evitar sobrescribirlo
    const { id: inputId, ...updateData } = updateClientInput;
    
    // Actualizar el cliente manteniendo los campos que no se modifican
    this.clients[clientIndex] = {
      ...this.clients[clientIndex],
      ...updateData,
    };

    return this.clients[clientIndex];
  }

  remove(id: string): Client {
    const clientIndex = this.clients.findIndex(client => client.id === id && !client.isDeleted);
    
    if (clientIndex === -1) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // Soft delete: marcar como eliminado en lugar de eliminar físicamente
    this.clients[clientIndex].isDeleted = true;
    
    return this.clients[clientIndex];
  }

  // Método adicional para restaurar un cliente eliminado
  restore(id: string): Client {
    const clientIndex = this.clients.findIndex(client => client.id === id && client.isDeleted);
    
    if (clientIndex === -1) {
      throw new NotFoundException(`Cliente eliminado con ID ${id} no encontrado`);
    }

    this.clients[clientIndex].isDeleted = false;
    
    return this.clients[clientIndex];
  }

  // Método para obtener todos los clientes incluyendo los eliminados (para administración)
  findAllIncludingDeleted(): Client[] {
    return this.clients;
  }

  // Método para eliminar permanentemente un cliente (hard delete)
  permanentDelete(id: string): boolean {
    const clientIndex = this.clients.findIndex(client => client.id === id);
    
    if (clientIndex === -1) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    this.clients.splice(clientIndex, 1);
    return true;
  }
}
