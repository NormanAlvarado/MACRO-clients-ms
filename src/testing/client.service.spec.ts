import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ClientService } from '../client/client.service';
import { Client } from '../client/entities/client.entity';
import { MetricsService } from '../metrics/metrics.service';
import { CreateClientInput } from '../client/dto/create-client.input';
import { UpdateClientInput } from '../client/dto/update-client.input';
import { PaginationInput } from '../client/dto/pagination.input';

describe('ClientService', () => {
  let service: ClientService;
  let clientRepository: Repository<Client>;
  let metricsService: MetricsService;

  // Mock data
  const mockClient: Client = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '1234567890',
    fecha_registro: new Date('2023-01-01'),
    isDeleted: false,
    preferences: undefined,
    addresses: []
  };

  const mockCreateClientInput: CreateClientInput = {
    nombre: 'María González',
    email: 'maria@example.com',
    telefono: '0987654321'
  };

  const mockUpdateClientInput: UpdateClientInput = {
    id: 1,
    nombre: 'Juan Carlos Pérez'
  };

  // Mock repository methods
  const mockClientRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  // Mock metrics service
  const mockMetricsService = {
    measureClientOperationDuration: jest.fn(() => ({ startTimer: () => jest.fn() })),
    incrementClientOperation: jest.fn(),
    incrementClientQuery: jest.fn(),
    incrementDatabaseError: jest.fn(),
    setActiveClientsCount: jest.fn(),
    setDeletedClientsCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
    metricsService = module.get<MetricsService>(MetricsService);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have clientRepository injected', () => {
      expect(clientRepository).toBeDefined();
    });

    it('should have metricsService injected', () => {
      expect(metricsService).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a new client successfully', async () => {
      const expectedClient = { ...mockClient, ...mockCreateClientInput, id: 2 };
      
      mockClientRepository.create.mockReturnValue(expectedClient);
      mockClientRepository.save.mockResolvedValue(expectedClient);
      mockClientRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);

      const result = await service.create(mockCreateClientInput);

      expect(mockClientRepository.create).toHaveBeenCalledWith({
        ...mockCreateClientInput,
        isDeleted: false,
      });
      expect(mockClientRepository.save).toHaveBeenCalledWith(expectedClient);
      expect(result).toEqual(expectedClient);
      
      // Verify metrics calls
      expect(mockMetricsService.measureClientOperationDuration).toHaveBeenCalledWith('create', 'success');
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('create', 'success', 'unknown');
      expect(mockMetricsService.incrementClientQuery).toHaveBeenCalledWith('insert', 'clientes', 'success');
    });

    it('should handle database errors during creation', async () => {
      const dbError = new Error('Database connection failed');
      
      mockClientRepository.create.mockReturnValue(mockClient);
      mockClientRepository.save.mockRejectedValue(dbError);

      await expect(service.create(mockCreateClientInput)).rejects.toThrow(dbError);
      
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('create', 'error', 'unknown');
      expect(mockMetricsService.incrementDatabaseError).toHaveBeenCalledWith('create', 'Error');
    });

    it('should call updateActiveClientsCount after successful creation', async () => {
      const expectedClient = { ...mockClient, ...mockCreateClientInput };
      
      mockClientRepository.create.mockReturnValue(expectedClient);
      mockClientRepository.save.mockResolvedValue(expectedClient);
      mockClientRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);

      await service.create(mockCreateClientInput);

      expect(mockClientRepository.count).toHaveBeenCalledTimes(2);
      expect(mockMetricsService.setActiveClientsCount).toHaveBeenCalledWith(5);
      expect(mockMetricsService.setDeletedClientsCount).toHaveBeenCalledWith(2);
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted clients with relations', async () => {
      const mockClients = [mockClient, { ...mockClient, id: 2, nombre: 'Ana García' }];
      
      mockClientRepository.find.mockResolvedValue(mockClients);

      const result = await service.findAll();

      expect(mockClientRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['preferences', 'addresses']
      });
      expect(result).toEqual(mockClients);
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('findAll', 'success', 'unknown');
    });

    it('should handle database errors during findAll', async () => {
      const dbError = new Error('Database query failed');
      
      mockClientRepository.find.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(dbError);
      
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('findAll', 'error', 'unknown');
      expect(mockMetricsService.incrementDatabaseError).toHaveBeenCalledWith('findAll', 'Error');
    });

    it('should return empty array when no clients exist', async () => {
      mockClientRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('findAll', 'success', 'unknown');
    });
  });

  describe('findAllPaginated', () => {
    const mockPaginationInput: PaginationInput = { page: 1, limit: 10 };
    
    it('should return paginated clients with correct metadata', async () => {
      const mockClients = [mockClient];
      const totalCount = 15;
      
      mockClientRepository.findAndCount.mockResolvedValue([mockClients, totalCount]);

      const result = await service.findAllPaginated(mockPaginationInput);

      expect(mockClientRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['preferences', 'addresses'],
        skip: 0,
        take: 10,
        order: { id: 'ASC' }
      });

      expect(result).toEqual({
        data: mockClients,
        total: totalCount,
        page: 1,
        limit: 10,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false
      });
    });

    it('should handle pagination for different page numbers', async () => {
      const paginationInput = { page: 2, limit: 5 };
      const mockClients = [mockClient];
      
      mockClientRepository.findAndCount.mockResolvedValue([mockClients, 12]);

      const result = await service.findAllPaginated(paginationInput);

      expect(mockClientRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['preferences', 'addresses'],
        skip: 5, // (2-1) * 5
        take: 5,
        order: { id: 'ASC' }
      });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(3); // ceil(12/5)
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
    });

    it('should use default pagination values', async () => {
      mockClientRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAllPaginated({});

      expect(mockClientRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['preferences', 'addresses'],
        skip: 0, // default page 1
        take: 10, // default limit
        order: { id: 'ASC' }
      });
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      mockClientRepository.findOne.mockResolvedValue(mockClient);

      const result = await service.findOne(1);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isDeleted: false },
        relations: ['preferences', 'addresses']
      });
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Cliente con ID 999 no encontrado')
      );

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, isDeleted: false },
        relations: ['preferences', 'addresses']
      });
    });

    it('should not return deleted clients', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isDeleted: false },
        relations: ['preferences', 'addresses']
      });
    });
  });

  describe('update', () => {
    it('should update a client successfully', async () => {
      const updatedClient = { ...mockClient, nombre: 'Juan Carlos Pérez' };
      
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.save.mockResolvedValue(updatedClient);

      const result = await service.update(1, mockUpdateClientInput);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isDeleted: false }
      });
      expect(mockClientRepository.save).toHaveBeenCalledWith({
        ...mockClient,
        nombre: 'Juan Carlos Pérez'
      });
      expect(result).toEqual(updatedClient);
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('update', 'success', 'unknown');
    });

    it('should throw NotFoundException when updating non-existent client', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateClientInput)).rejects.toThrow(
        new NotFoundException('Cliente con ID 999 no encontrado')
      );

      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('update', 'error', 'unknown');
      expect(mockMetricsService.incrementDatabaseError).not.toHaveBeenCalled();
    });

    it('should exclude id from update data', async () => {
      const updateInputWithId = { id: 5, nombre: 'Nuevo Nombre' };
      const updatedClient = { ...mockClient, nombre: 'Nuevo Nombre' };
      
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.save.mockResolvedValue(updatedClient);

      await service.update(1, updateInputWithId);

      // Verify that Object.assign was called without the id
      expect(mockClientRepository.save).toHaveBeenCalledWith({
        ...mockClient,
        nombre: 'Nuevo Nombre'
        // id should remain as original mockClient.id (1)
      });
    });

    it('should handle database errors during update', async () => {
      const dbError = new Error('Update failed');
      
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.save.mockRejectedValue(dbError);

      await expect(service.update(1, mockUpdateClientInput)).rejects.toThrow(dbError);
      
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('update', 'error', 'unknown');
      expect(mockMetricsService.incrementDatabaseError).toHaveBeenCalledWith('update', 'Error');
    });
  });

  describe('remove (soft delete)', () => {
    it('should soft delete a client successfully', async () => {
      const deletedClient = { ...mockClient, isDeleted: true };
      
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.save.mockResolvedValue(deletedClient);
      mockClientRepository.count.mockResolvedValueOnce(4).mockResolvedValueOnce(3);

      const result = await service.remove(1);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isDeleted: false }
      });
      expect(mockClientRepository.save).toHaveBeenCalledWith({
        ...mockClient,
        isDeleted: true
      });
      expect(result).toEqual(deletedClient);
      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('remove', 'success', 'unknown');
    });

    it('should throw NotFoundException when removing non-existent client', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Cliente con ID 999 no encontrado')
      );

      expect(mockMetricsService.incrementClientOperation).toHaveBeenCalledWith('remove', 'error', 'unknown');
    });

    it('should update active clients count after soft delete', async () => {
      const deletedClient = { ...mockClient, isDeleted: true };
      
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.save.mockResolvedValue(deletedClient);
      mockClientRepository.count.mockResolvedValueOnce(4).mockResolvedValueOnce(3);

      await service.remove(1);

      expect(mockMetricsService.setActiveClientsCount).toHaveBeenCalledWith(4);
      expect(mockMetricsService.setDeletedClientsCount).toHaveBeenCalledWith(3);
    });
  });

  describe('restore', () => {
    it('should restore a deleted client successfully', async () => {
      const deletedClient = { ...mockClient, isDeleted: true };
      const restoredClient = { ...mockClient, isDeleted: false };
      
      mockClientRepository.findOne.mockResolvedValue(deletedClient);
      mockClientRepository.save.mockResolvedValue(restoredClient);

      const result = await service.restore(1);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isDeleted: true }
      });
      expect(mockClientRepository.save).toHaveBeenCalledWith({
        ...deletedClient,
        isDeleted: false
      });
      expect(result).toEqual(restoredClient);
    });

    it('should throw NotFoundException when restoring non-deleted client', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.restore(999)).rejects.toThrow(
        new NotFoundException('Cliente eliminado con ID 999 no encontrado')
      );
    });
  });

  describe('findAllIncludingDeleted', () => {
    it('should return all clients including deleted ones', async () => {
      const allClients = [
        mockClient,
        { ...mockClient, id: 2, isDeleted: true }
      ];
      
      mockClientRepository.find.mockResolvedValue(allClients);

      const result = await service.findAllIncludingDeleted();

      expect(mockClientRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(allClients);
    });
  });

  describe('permanentDelete', () => {
    it('should permanently delete a client successfully', async () => {
      mockClientRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.permanentDelete(1);

      expect(mockClientRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException when permanently deleting non-existent client', async () => {
      mockClientRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.permanentDelete(999)).rejects.toThrow(
        new NotFoundException('Cliente con ID 999 no encontrado')
      );
    });
  });

  describe('updateActiveClientsCount (private method)', () => {
    it('should handle metrics update errors gracefully', async () => {
      // This tests the private method indirectly through create
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      mockClientRepository.create.mockReturnValue(mockClient);
      mockClientRepository.save.mockResolvedValue(mockClient);
      mockClientRepository.count.mockRejectedValue(new Error('Metrics error'));

      // Should not throw despite metrics error
      await expect(service.create(mockCreateClientInput)).resolves.toBeDefined();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error actualizando métricas de clientes:',
        'Metrics error'
      );
      
      consoleSpy.mockRestore();
    });
  });
});