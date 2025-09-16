import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>
  ) {}

  async create(createClientInput: CreateClientInput): Promise<Client> {
    const newClient = new this.clientModel({
      ...createClientInput,
      isDeleted: false,
    });

    return await newClient.save();
  }

  async findAll(): Promise<Client[]> {
    // Retorna solo los clientes que no han sido eliminados (soft delete)
    return await this.clientModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findOne({ _id: id, isDeleted: false }).exec();
    
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return client;
  }

  async update(id: string, updateClientInput: UpdateClientInput): Promise<Client> {
    // Excluir el id del updateInput para evitar sobrescribirlo
    const { id: inputId, ...updateData } = updateClientInput;
    
    const updatedClient = await this.clientModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true }
    ).exec();
    
    if (!updatedClient) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return updatedClient;
  }

  async remove(id: string): Promise<Client> {
    // Soft delete: marcar como eliminado en lugar de eliminar físicamente
    const deletedClient = await this.clientModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    ).exec();
    
    if (!deletedClient) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return deletedClient;
  }

  // Método adicional para restaurar un cliente eliminado
  async restore(id: string): Promise<Client> {
    const restoredClient = await this.clientModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    ).exec();
    
    if (!restoredClient) {
      throw new NotFoundException(`Cliente eliminado con ID ${id} no encontrado`);
    }

    return restoredClient;
  }

  // Método para obtener todos los clientes incluyendo los eliminados (para administración)
  async findAllIncludingDeleted(): Promise<Client[]> {
    return await this.clientModel.find().exec();
  }

  // Método para eliminar permanentemente un cliente (hard delete)
  async permanentDelete(id: string): Promise<boolean> {
    const result = await this.clientModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return true;
  }
}
