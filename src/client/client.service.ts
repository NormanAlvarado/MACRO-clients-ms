import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { PaginationInput } from './dto/pagination.input';
import { PaginatedClients } from './dto/paginated-clients.output';
import { Client } from './entities/client.entity';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly metricsService: MetricsService
  ) {}

  async create(createClientInput: CreateClientInput): Promise<Client> {
    const timer = this.metricsService.measureClientOperationDuration('create', 'success');
    const end = timer.startTimer();
    
    try {
      const newClient = this.clientRepository.create({
        ...createClientInput,
        isDeleted: false,
      });

      const result = await this.clientRepository.save(newClient);
      
      // Registrar métricas exitosas
      this.metricsService.incrementClientOperation('create', 'success', 'unknown');
      this.metricsService.incrementClientQuery('insert', 'clientes', 'success');
      end();
      
      // Actualizar contador de clientes activos
      await this.updateActiveClientsCount();
      
      return result;
    } catch (error) {
      end();
      this.metricsService.incrementClientOperation('create', 'error', 'unknown');
      this.metricsService.incrementClientQuery('insert', 'clientes', 'error');
      this.metricsService.incrementDatabaseError('create', error.constructor.name);
      throw error;
    }
  }

  async findAll(): Promise<Client[]> {
    const timer = this.metricsService.measureClientOperationDuration('findAll', 'success');
    const end = timer.startTimer();
    
    try {
      // Retorna solo los clientes que no han sido eliminados (soft delete)
      const result = await this.clientRepository.find({ 
        where: { isDeleted: false },
        relations: ['preferences', 'addresses']
      });
      
      this.metricsService.incrementClientOperation('findAll', 'success', 'unknown');
      this.metricsService.incrementClientQuery('select', 'clientes', 'success');
      end();
      return result;
    } catch (error) {
      end();
      this.metricsService.incrementClientOperation('findAll', 'error', 'unknown');
      this.metricsService.incrementClientQuery('select', 'clientes', 'error');
      this.metricsService.incrementDatabaseError('findAll', error.constructor.name);
      throw error;
    }
  }

  async findAllPaginated(paginationInput: PaginationInput): Promise<PaginatedClients> {
    const { page = 1, limit = 10 } = paginationInput;
    const skip = (page - 1) * limit;

    const [data, total] = await this.clientRepository.findAndCount({
      where: { isDeleted: false },
      relations: ['preferences', 'addresses'],
      skip,
      take: limit,
      order: { id: 'ASC' }
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
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
    const timer = this.metricsService.measureClientOperationDuration('update', 'success');
    const end = timer.startTimer();
    
    try {
      // Excluir el id del updateInput para evitar sobrescribirlo
      const { id: inputId, ...updateData } = updateClientInput;
      
      const client = await this.clientRepository.findOne({ 
        where: { id, isDeleted: false }
      });
      
      if (!client) {
        end();
        this.metricsService.incrementClientOperation('update', 'error', 'unknown');
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      Object.assign(client, updateData);
      const result = await this.clientRepository.save(client);
      
      this.metricsService.incrementClientOperation('update', 'success', 'unknown');
      this.metricsService.incrementClientQuery('update', 'clientes', 'success');
      end();
      return result;
    } catch (error) {
      end();
      this.metricsService.incrementClientOperation('update', 'error', 'unknown');
      if (!(error instanceof NotFoundException)) {
        this.metricsService.incrementDatabaseError('update', error.constructor.name);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<Client> {
    const timer = this.metricsService.measureClientOperationDuration('remove', 'success');
    const end = timer.startTimer();
    
    try {
      // Soft delete: marcar como eliminado en lugar de eliminar físicamente
      const client = await this.clientRepository.findOne({ 
        where: { id, isDeleted: false }
      });
      
      if (!client) {
        end();
        this.metricsService.incrementClientOperation('remove', 'error', 'unknown');
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }
      
      client.isDeleted = true;
      const result = await this.clientRepository.save(client);
      
      this.metricsService.incrementClientOperation('remove', 'success', 'unknown');
      this.metricsService.incrementClientQuery('update', 'clientes', 'success');
      end();
      
      // Actualizar contador de clientes activos
      await this.updateActiveClientsCount();
      
      return result;
    } catch (error) {
      end();
      this.metricsService.incrementClientOperation('remove', 'error', 'unknown');
      if (!(error instanceof NotFoundException)) {
        this.metricsService.incrementDatabaseError('remove', error.constructor.name);
      }
      throw error;
    }
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

  // Método privado para actualizar contadores de clientes
  private async updateActiveClientsCount(): Promise<void> {
    try {
      const activeCount = await this.clientRepository.count({ 
        where: { isDeleted: false } 
      });
      const deletedCount = await this.clientRepository.count({ 
        where: { isDeleted: true } 
      });
      
      this.metricsService.setActiveClientsCount(activeCount);
      this.metricsService.setDeletedClientsCount(deletedCount);
    } catch (error) {
      // Si falla la actualización de métricas, no interrumpir el flujo principal
      console.warn('Error actualizando métricas de clientes:', error.message);
    }
  }
}
