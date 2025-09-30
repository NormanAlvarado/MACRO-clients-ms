import { Client } from '../client/entities/client.entity';
import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { ClientAddress } from '../client/entities/client-address.entity';

describe('Entity Integration Tests', () => {
  describe('Client with full relationships', () => {
    it('should create a client with preferences and multiple addresses', () => {
      // Create client
      const client = new Client();
      client.id = 1;
      client.nombre = 'Juan Carlos Rodríguez Méndez';
      client.email = 'juan.rodriguez@empresa.co.cr';
      client.telefono = '+506 8888-9999';
      client.fecha_registro = new Date('2023-01-15T10:30:00Z');
      client.isDeleted = false;

      // Create preferences
      const preferences = new ClientPreferences();
      preferences.id = 1;
      preferences.cliente_id = client.id;
      preferences.idioma = 'es';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;
      preferences.client = client;

      // Create addresses
      const principalAddress = new ClientAddress();
      principalAddress.id = 1;
      principalAddress.cliente_id = client.id;
      principalAddress.nombre_sucursal = 'Oficina Central';
      principalAddress.calle = 'Del Banco Nacional 200m Norte, 100m Este, Edificio Torre Empresarial, Piso 5';
      principalAddress.ciudad = 'San José';
      principalAddress.estado_provincia = 'San José';
      principalAddress.codigo_postal = '10101';
      principalAddress.pais = 'Costa Rica';
      principalAddress.es_principal = true;
      principalAddress.fecha_creacion = new Date('2023-01-15T10:35:00Z');
      principalAddress.is_deleted = false;
      principalAddress.client = client;

      const secondaryAddress = new ClientAddress();
      secondaryAddress.id = 2;
      secondaryAddress.cliente_id = client.id;
      secondaryAddress.nombre_sucursal = 'Sucursal Cartago';
      secondaryAddress.calle = 'Avenida Central, Calles 2 y 4, Local 15';
      secondaryAddress.ciudad = 'Cartago';
      secondaryAddress.estado_provincia = 'Cartago';
      secondaryAddress.codigo_postal = '30101';
      secondaryAddress.pais = 'Costa Rica';
      secondaryAddress.es_principal = false;
      secondaryAddress.fecha_creacion = new Date('2023-02-01T09:00:00Z');
      secondaryAddress.is_deleted = false;
      secondaryAddress.client = client;

      // Set relationships
      client.preferences = preferences;
      client.addresses = [principalAddress, secondaryAddress];

      // Verify complete integration
      expect(client.id).toBe(1);
      expect(client.nombre).toBe('Juan Carlos Rodríguez Méndez');
      expect(client.email).toBe('juan.rodriguez@empresa.co.cr');
      expect(client.preferences).toBe(preferences);
      expect(client.addresses).toHaveLength(2);
      
      // Verify preferences relationship
      expect(client.preferences.cliente_id).toBe(client.id);
      expect(client.preferences.client).toBe(client);
      expect(client.preferences.idioma).toBe('es');
      
      // Verify address relationships
      expect(client.addresses[0].cliente_id).toBe(client.id);
      expect(client.addresses[0].client).toBe(client);
      expect(client.addresses[0].es_principal).toBe(true);
      
      expect(client.addresses[1].cliente_id).toBe(client.id);
      expect(client.addresses[1].client).toBe(client);
      expect(client.addresses[1].es_principal).toBe(false);
      
      // Verify only one principal address
      const principalAddresses = client.addresses.filter(addr => addr.es_principal);
      expect(principalAddresses).toHaveLength(1);
    });
  });

  describe('Business logic validations', () => {
    it('should maintain consistency in client relationships', () => {
      const client = new Client();
      client.id = 100;
      client.nombre = 'María Elena Vega';
      client.email = 'maria.vega@test.com';

      const preferences = new ClientPreferences();
      preferences.id = 50;
      preferences.cliente_id = client.id;
      preferences.client = client;

      const address = new ClientAddress();
      address.id = 200;
      address.cliente_id = client.id;
      address.client = client;

      // All entities should reference the same client ID
      expect(client.id).toBe(preferences.cliente_id);
      expect(client.id).toBe(address.cliente_id);
      expect(preferences.client).toBe(client);
      expect(address.client).toBe(client);
    });

    it('should handle soft delete scenarios correctly', () => {
      const client = new Client();
      client.id = 1;
      client.isDeleted = false;

      const address1 = new ClientAddress();
      address1.id = 1;
      address1.cliente_id = client.id;
      address1.is_deleted = false;
      address1.es_principal = true;

      const address2 = new ClientAddress();
      address2.id = 2;
      address2.cliente_id = client.id;
      address2.is_deleted = true; // Soft deleted
      address2.es_principal = false;

      client.addresses = [address1, address2];

      // Active addresses (not soft deleted)
      const activeAddresses = client.addresses.filter(addr => !addr.is_deleted);
      const deletedAddresses = client.addresses.filter(addr => addr.is_deleted);

      expect(activeAddresses).toHaveLength(1);
      expect(deletedAddresses).toHaveLength(1);
      expect(activeAddresses[0].es_principal).toBe(true);
    });

    it('should handle Costa Rican specific data correctly', () => {
      const client = new Client();
      client.telefono = '+506 8888-9999'; // Costa Rican format

      const address = new ClientAddress();
      address.calle = 'Del Mall San Pedro 300m Sur, 150m Oeste';
      address.ciudad = 'San Pedro de Montes de Oca';
      address.estado_provincia = 'San José';
      address.codigo_postal = '11501';
      address.pais = 'Costa Rica';

      const preferences = new ClientPreferences();
      preferences.idioma = 'es'; // Spanish for Costa Rica

      expect(client.telefono).toContain('+506');
      expect(address.pais).toBe('Costa Rica');
      expect(address.calle).toContain('Del Mall');
      expect(preferences.idioma).toBe('es');
    });
  });

  describe('Data serialization and persistence scenarios', () => {
    it('should serialize complete entity graph to JSON', () => {
      const client = new Client();
      client.id = 1;
      client.nombre = 'Test Client';
      client.email = 'test@example.com';
      client.telefono = '1234567890';
      client.fecha_registro = new Date('2023-01-01T00:00:00Z');
      client.isDeleted = false;

      const preferences = new ClientPreferences();
      preferences.id = 1;
      preferences.cliente_id = client.id;
      preferences.idioma = 'es';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;

      const address = new ClientAddress();
      address.id = 1;
      address.cliente_id = client.id;
      address.calle = 'Test Street';
      address.ciudad = 'Test City';
      address.estado_provincia = 'Test Province';
      address.codigo_postal = '12345';
      address.pais = 'Costa Rica';
      address.es_principal = true;
      address.fecha_creacion = new Date('2023-01-01T12:00:00Z');
      address.is_deleted = false;

      client.preferences = preferences;
      client.addresses = [address];

      const json = JSON.stringify(client);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(1);
      expect(parsed.nombre).toBe('Test Client');
      expect(parsed.preferences.idioma).toBe('es');
      expect(parsed.addresses).toHaveLength(1);
      expect(parsed.addresses[0].es_principal).toBe(true);
    });
  });

  describe('Edge cases and error scenarios', () => {
    it('should handle entities with minimal data', () => {
      const client = new Client();
      const preferences = new ClientPreferences();
      const address = new ClientAddress();

      // Should not throw errors with minimal data
      expect(() => {
        client.id = 1;
        preferences.id = 1;
        address.id = 1;
      }).not.toThrow();

      expect(client.id).toBe(1);
      expect(preferences.id).toBe(1);
      expect(address.id).toBe(1);
    });

    it('should handle maximum length values', () => {
      const client = new Client();
      client.nombre = 'A'.repeat(150); // Maximum length
      client.email = 'test@' + 'a'.repeat(140) + '.com'; // Long email
      client.telefono = '+506-' + '8'.repeat(15); // Long phone

      const address = new ClientAddress();
      address.nombre_sucursal = 'B'.repeat(100); // Maximum branch name
      address.calle = 'C'.repeat(200); // Maximum street length
      address.ciudad = 'D'.repeat(100); // Maximum city length
      address.estado_provincia = 'E'.repeat(100); // Maximum province length
      address.codigo_postal = 'F'.repeat(20); // Maximum postal code
      address.pais = 'G'.repeat(50); // Maximum country length

      const preferences = new ClientPreferences();
      preferences.idioma = 'es-CR-test'; // Language code

      expect(client.nombre.length).toBe(150);
      expect(address.calle.length).toBe(200);
      expect(address.codigo_postal.length).toBe(20);
      expect(preferences.idioma).toBe('es-CR-test');
    });

    it('should handle date edge cases', () => {
      const client = new Client();
      const address = new ClientAddress();

      // Past date
      const pastDate = new Date('2020-01-01T00:00:00Z');
      client.fecha_registro = pastDate;
      address.fecha_creacion = pastDate;

      // Future date
      const futureDate = new Date('2030-12-31T23:59:59Z');
      client.fecha_registro = futureDate;
      address.fecha_creacion = futureDate;

      expect(client.fecha_registro).toBeInstanceOf(Date);
      expect(address.fecha_creacion).toBeInstanceOf(Date);
      expect(client.fecha_registro.getTime()).toBe(futureDate.getTime());
    });
  });
});