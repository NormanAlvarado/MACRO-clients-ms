import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ClientPreferencesService } from '../client/client-preferences.service';
import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { Client } from '../client/entities/client.entity';
import { CreateClientPreferencesInput } from '../client/dto/create-client-preferences.input';
import { UpdateClientPreferencesInput } from '../client/dto/update-client-preferences.input';

describe('ClientPreferencesService', () => {
  let service: ClientPreferencesService;
  let preferencesRepository: Repository<ClientPreferences>;

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

  const mockPreferences: ClientPreferences = {
    id: 1,
    cliente_id: 1,
    idioma: 'es',
    notificaciones_email: true,
    notificaciones_push: false,
    client: mockClient
  };

  const mockCreatePreferencesInput: CreateClientPreferencesInput = {
    cliente_id: 1,
    idioma: 'en',
    notificaciones_email: false,
    notificaciones_push: true
  };

  const mockUpdatePreferencesInput: UpdateClientPreferencesInput = {
    id: 1,
    idioma: 'fr',
    notificaciones_push: true
  };

  // Mock repository methods
  const mockPreferencesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientPreferencesService,
        {
          provide: getRepositoryToken(ClientPreferences),
          useValue: mockPreferencesRepository,
        },
      ],
    }).compile();

    service = module.get<ClientPreferencesService>(ClientPreferencesService);
    preferencesRepository = module.get<Repository<ClientPreferences>>(
      getRepositoryToken(ClientPreferences)
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have preferencesRepository injected', () => {
      expect(preferencesRepository).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create new client preferences successfully', async () => {
      const expectedPreferences = {
        ...mockPreferences,
        ...mockCreatePreferencesInput,
        id: 2
      };

      mockPreferencesRepository.create.mockReturnValue(expectedPreferences);
      mockPreferencesRepository.save.mockResolvedValue(expectedPreferences);

      const result = await service.create(mockCreatePreferencesInput);

      expect(mockPreferencesRepository.create).toHaveBeenCalledWith(mockCreatePreferencesInput);
      expect(mockPreferencesRepository.save).toHaveBeenCalledWith(expectedPreferences);
      expect(result).toEqual(expectedPreferences);
    });

    it('should handle database errors during creation', async () => {
      const dbError = new Error('Database connection failed');

      mockPreferencesRepository.create.mockReturnValue(mockPreferences);
      mockPreferencesRepository.save.mockRejectedValue(dbError);

      await expect(service.create(mockCreatePreferencesInput)).rejects.toThrow(dbError);

      expect(mockPreferencesRepository.create).toHaveBeenCalledWith(mockCreatePreferencesInput);
      expect(mockPreferencesRepository.save).toHaveBeenCalled();
    });

    it('should create preferences with default values', async () => {
      const minimalInput = { cliente_id: 1 };
      const createdPreferences = { ...mockPreferences, ...minimalInput };

      mockPreferencesRepository.create.mockReturnValue(createdPreferences);
      mockPreferencesRepository.save.mockResolvedValue(createdPreferences);

      const result = await service.create(minimalInput as CreateClientPreferencesInput);

      expect(mockPreferencesRepository.create).toHaveBeenCalledWith(minimalInput);
      expect(result).toEqual(createdPreferences);
    });
  });

  describe('findAll', () => {
    it('should return all preferences with client relations', async () => {
      const mockPreferencesList = [
        mockPreferences,
        { ...mockPreferences, id: 2, cliente_id: 2, idioma: 'en' }
      ];

      mockPreferencesRepository.find.mockResolvedValue(mockPreferencesList);

      const result = await service.findAll();

      expect(mockPreferencesRepository.find).toHaveBeenCalledWith({
        relations: ['client'],
      });
      expect(result).toEqual(mockPreferencesList);
    });

    it('should return empty array when no preferences exist', async () => {
      mockPreferencesRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPreferencesRepository.find).toHaveBeenCalledWith({
        relations: ['client'],
      });
    });

    it('should handle database errors during findAll', async () => {
      const dbError = new Error('Database query failed');

      mockPreferencesRepository.find.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(dbError);
    });
  });

  describe('findOne', () => {
    it('should return preferences by id with client relation', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);

      const result = await service.findOne(1);

      expect(mockPreferencesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['client'],
      });
      expect(result).toEqual(mockPreferences);
    });

    it('should throw NotFoundException when preferences not found', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Preferencias con ID 999 no encontradas')
      );

      expect(mockPreferencesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['client'],
      });
    });
  });

  describe('findByClientId', () => {
    it('should return preferences by client ID', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);

      const result = await service.findByClientId(1);

      expect(mockPreferencesRepository.findOne).toHaveBeenCalledWith({
        where: { cliente_id: 1 },
        relations: ['client'],
      });
      expect(result).toEqual(mockPreferences);
    });

    it('should return null when no preferences found for client', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(null);

      const result = await service.findByClientId(999);

      expect(result).toBeNull();
      expect(mockPreferencesRepository.findOne).toHaveBeenCalledWith({
        where: { cliente_id: 999 },
        relations: ['client'],
      });
    });

    it('should handle database errors during findByClientId', async () => {
      const dbError = new Error('Database query failed');

      mockPreferencesRepository.findOne.mockRejectedValue(dbError);

      await expect(service.findByClientId(1)).rejects.toThrow(dbError);
    });
  });

  describe('update', () => {
    it('should update preferences successfully', async () => {
      const updatedPreferences = {
        ...mockPreferences,
        idioma: 'fr',
        notificaciones_push: true
      };

      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);
      mockPreferencesRepository.save.mockResolvedValue(updatedPreferences);

      const result = await service.update(1, mockUpdatePreferencesInput);

      expect(mockPreferencesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['client'],
      });
      expect(mockPreferencesRepository.save).toHaveBeenCalledWith({
        ...mockPreferences,
        ...mockUpdatePreferencesInput
      });
      expect(result).toEqual(updatedPreferences);
    });

    it('should throw NotFoundException when updating non-existent preferences', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, mockUpdatePreferencesInput)).rejects.toThrow(
        new NotFoundException('Preferencias con ID 999 no encontradas')
      );

      expect(mockPreferencesRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const partialUpdate = { id: 1, idioma: 'de' };
      const updatedPreferences = { ...mockPreferences, idioma: 'de' };

      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);
      mockPreferencesRepository.save.mockResolvedValue(updatedPreferences);

      const result = await service.update(1, partialUpdate);

      expect(mockPreferencesRepository.save).toHaveBeenCalledWith({
        ...mockPreferences,
        idioma: 'de'
      });
      expect(result).toEqual(updatedPreferences);
    });

    it('should handle database errors during update', async () => {
      const dbError = new Error('Update failed');

      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);
      mockPreferencesRepository.save.mockRejectedValue(dbError);

      await expect(service.update(1, mockUpdatePreferencesInput)).rejects.toThrow(dbError);
    });
  });

  describe('remove', () => {
    it('should remove preferences successfully', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);
      mockPreferencesRepository.remove.mockResolvedValue(mockPreferences);

      const result = await service.remove(1);

      expect(mockPreferencesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['client'],
      });
      expect(mockPreferencesRepository.remove).toHaveBeenCalledWith(mockPreferences);
      expect(result).toEqual(mockPreferences);
    });

    it('should throw NotFoundException when removing non-existent preferences', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Preferencias con ID 999 no encontradas')
      );

      expect(mockPreferencesRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      const dbError = new Error('Remove failed');

      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);
      mockPreferencesRepository.remove.mockRejectedValue(dbError);

      await expect(service.remove(1)).rejects.toThrow(dbError);
    });
  });

  describe('Language Settings', () => {
    it('should handle different language codes', async () => {
      const languages = ['es', 'en', 'fr', 'de', 'it'];

      for (const lang of languages) {
        const input = { ...mockCreatePreferencesInput, idioma: lang };
        const expected = { ...mockPreferences, idioma: lang };

        mockPreferencesRepository.create.mockReturnValue(expected);
        mockPreferencesRepository.save.mockResolvedValue(expected);

        const result = await service.create(input);

        expect(result.idioma).toBe(lang);
      }
    });
  });

  describe('Notification Settings', () => {
    it('should handle all combinations of notification settings', async () => {
      const combinations = [
        { notificaciones_email: true, notificaciones_push: true },
        { notificaciones_email: true, notificaciones_push: false },
        { notificaciones_email: false, notificaciones_push: true },
        { notificaciones_email: false, notificaciones_push: false },
      ];

      for (const combo of combinations) {
        const input = { ...mockCreatePreferencesInput, ...combo };
        const expected = { ...mockPreferences, ...combo };

        mockPreferencesRepository.create.mockReturnValue(expected);
        mockPreferencesRepository.save.mockResolvedValue(expected);

        const result = await service.create(input);

        expect(result.notificaciones_email).toBe(combo.notificaciones_email);
        expect(result.notificaciones_push).toBe(combo.notificaciones_push);
      }
    });

    it('should handle notification preferences update', async () => {
      const originalPrefs = {
        ...mockPreferences,
        notificaciones_email: false,
        notificaciones_push: false
      };

      const update = {
        id: 1,
        notificaciones_email: true,
        notificaciones_push: true
      };

      const updatedPrefs = { ...originalPrefs, ...update };

      mockPreferencesRepository.findOne.mockResolvedValue(originalPrefs);
      mockPreferencesRepository.save.mockResolvedValue(updatedPrefs);

      const result = await service.update(1, update);

      expect(result.notificaciones_email).toBe(true);
      expect(result.notificaciones_push).toBe(true);
    });
  });

  describe('Client Relationship', () => {
    it('should maintain client relationship on creation', async () => {
      const preferencesWithClient = {
        ...mockPreferences,
        client: mockClient
      };

      mockPreferencesRepository.create.mockReturnValue(preferencesWithClient);
      mockPreferencesRepository.save.mockResolvedValue(preferencesWithClient);

      const result = await service.create(mockCreatePreferencesInput);

      expect(result.cliente_id).toBe(mockClient.id);
      expect(result.client).toBeDefined();
    });

    it('should include client data in findOne results', async () => {
      const preferencesWithClient = {
        ...mockPreferences,
        client: {
          ...mockClient,
          nombre: 'Cliente Test',
          email: 'cliente@test.com'
        }
      };

      mockPreferencesRepository.findOne.mockResolvedValue(preferencesWithClient);

      const result = await service.findOne(1);

      expect(result.client).toBeDefined();
      expect(result.client.nombre).toBe('Cliente Test');
      expect(result.client.email).toBe('cliente@test.com');
    });
  });

  describe('Edge Cases', () => {
    it('should handle preferences with minimal data', async () => {
      const minimalPrefs = {
        id: 1,
        cliente_id: 1,
        idioma: 'es',
        notificaciones_email: true,
        notificaciones_push: false,
        client: undefined
      };

      mockPreferencesRepository.findOne.mockResolvedValue(minimalPrefs);

      const result = await service.findOne(1);

      expect(result).toEqual(minimalPrefs);
      expect(result.client).toBeUndefined();
    });

    it('should handle long language codes', async () => {
      const longLangCode = 'es-CR-UTF8';
      const input = { ...mockCreatePreferencesInput, idioma: longLangCode };
      const expected = { ...mockPreferences, idioma: longLangCode };

      mockPreferencesRepository.create.mockReturnValue(expected);
      mockPreferencesRepository.save.mockResolvedValue(expected);

      const result = await service.create(input);

      expect(result.idioma).toBe(longLangCode);
    });

    it('should handle concurrent updates gracefully', async () => {
      mockPreferencesRepository.findOne.mockResolvedValue(mockPreferences);
      mockPreferencesRepository.save.mockResolvedValue(mockPreferences);

      // Simulate concurrent updates
      const update1 = service.update(1, { id: 1, idioma: 'en' });
      const update2 = service.update(1, { id: 1, notificaciones_email: false });

      await Promise.all([update1, update2]);

      expect(mockPreferencesRepository.save).toHaveBeenCalledTimes(2);
    });
  });
});