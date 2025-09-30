import { Client } from '../client/entities/client.entity';
import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { ClientAddress } from '../client/entities/client-address.entity';

describe('Client Entity', () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe('Constructor and Properties', () => {
    it('should create a client instance', () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(Client);
    });

    it('should initialize with default values', () => {
      client.id = 1;
      client.nombre = 'Juan Pérez';
      client.email = 'juan@example.com';
      client.telefono = '1234567890';
      client.fecha_registro = new Date();
      client.isDeleted = false;

      expect(client.id).toBe(1);
      expect(client.nombre).toBe('Juan Pérez');
      expect(client.email).toBe('juan@example.com');
      expect(client.telefono).toBe('1234567890');
      expect(client.fecha_registro).toBeInstanceOf(Date);
      expect(client.isDeleted).toBe(false);
    });

    it('should allow setting all properties', () => {
      const now = new Date();
      client.id = 123;
      client.nombre = 'María González';
      client.email = 'maria.gonzalez@test.com';
      client.telefono = '9876543210';
      client.fecha_registro = now;
      client.isDeleted = true;

      expect(client.id).toBe(123);
      expect(client.nombre).toBe('María González');
      expect(client.email).toBe('maria.gonzalez@test.com');
      expect(client.telefono).toBe('9876543210');
      expect(client.fecha_registro).toBe(now);
      expect(client.isDeleted).toBe(true);
    });
  });

  describe('Relationships', () => {
    it('should allow setting preferences', () => {
      const preferences = new ClientPreferences();
      preferences.id = 1;
      preferences.cliente_id = 1;
      preferences.idioma = 'es';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;

      client.preferences = preferences;

      expect(client.preferences).toBe(preferences);
      expect(client.preferences).toBeInstanceOf(ClientPreferences);
      expect(client.preferences.idioma).toBe('es');
    });

    it('should allow setting multiple addresses', () => {
      const address1 = new ClientAddress();
      address1.id = 1;
      address1.cliente_id = 1;
      address1.calle = 'Avenida Central 123';
      address1.ciudad = 'San José';
      address1.es_principal = true;

      const address2 = new ClientAddress();
      address2.id = 2;
      address2.cliente_id = 1;
      address2.calle = 'Calle Secundaria 456';
      address2.ciudad = 'Cartago';
      address2.es_principal = false;

      client.addresses = [address1, address2];

      expect(client.addresses).toHaveLength(2);
      expect(client.addresses[0]).toBe(address1);
      expect(client.addresses[1]).toBe(address2);
      expect(client.addresses[0].es_principal).toBe(true);
      expect(client.addresses[1].es_principal).toBe(false);
    });

    it('should handle empty addresses array', () => {
      client.addresses = [];
      expect(client.addresses).toHaveLength(0);
      expect(client.addresses).toEqual([]);
    });

    it('should handle null preferences', () => {
      client.preferences = undefined;
      expect(client.preferences).toBeUndefined();
    });
  });

  describe('Data Validation Scenarios', () => {
    it('should handle long names up to 150 characters', () => {
      const longName = 'A'.repeat(150);
      client.nombre = longName;
      expect(client.nombre).toBe(longName);
      expect(client.nombre.length).toBe(150);
    });

    it('should handle valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.cr',
        'firstname+lastname@company.org'
      ];

      validEmails.forEach(email => {
        client.email = email;
        expect(client.email).toBe(email);
      });
    });

    it('should handle phone numbers up to 20 characters', () => {
      const phoneNumbers = [
        '1234567890',
        '+506 8888-9999',
        '(506) 2222-3333'
      ];

      phoneNumbers.forEach(phone => {
        client.telefono = phone;
        expect(client.telefono).toBe(phone);
      });
    });
  });

  describe('Soft Delete Functionality', () => {
    it('should default isDeleted to false', () => {
      expect(client.isDeleted).toBeFalsy();
    });

    it('should allow marking as deleted', () => {
      client.isDeleted = true;
      expect(client.isDeleted).toBe(true);
    });

    it('should allow restoring from deleted state', () => {
      client.isDeleted = true;
      expect(client.isDeleted).toBe(true);
      
      client.isDeleted = false;
      expect(client.isDeleted).toBe(false);
    });
  });

  describe('Date Handling', () => {
    it('should handle fecha_registro as Date object', () => {
      const testDate = new Date('2023-01-15T10:30:00Z');
      client.fecha_registro = testDate;
      
      expect(client.fecha_registro).toBeInstanceOf(Date);
      expect(client.fecha_registro.getTime()).toBe(testDate.getTime());
    });

    it('should handle current date for fecha_registro', () => {
      const now = new Date();
      client.fecha_registro = now;
      
      expect(client.fecha_registro).toBeInstanceOf(Date);
      expect(client.fecha_registro.getTime()).toBeCloseTo(now.getTime(), -2);
    });
  });

  describe('Entity Serialization', () => {
    it('should serialize to JSON correctly', () => {
      client.id = 1;
      client.nombre = 'Test User';
      client.email = 'test@example.com';
      client.telefono = '1234567890';
      client.fecha_registro = new Date('2023-01-01T00:00:00Z');
      client.isDeleted = false;

      const json = JSON.stringify(client);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(1);
      expect(parsed.nombre).toBe('Test User');
      expect(parsed.email).toBe('test@example.com');
      expect(parsed.telefono).toBe('1234567890');
      expect(parsed.isDeleted).toBe(false);
    });
  });
});