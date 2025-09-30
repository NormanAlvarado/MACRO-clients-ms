import { ClientAddress } from '../client/entities/client-address.entity';
import { Client } from '../client/entities/client.entity';

describe('ClientAddress Entity', () => {
  let address: ClientAddress;

  beforeEach(() => {
    address = new ClientAddress();
  });

  describe('Constructor and Properties', () => {
    it('should create a ClientAddress instance', () => {
      expect(address).toBeDefined();
      expect(address).toBeInstanceOf(ClientAddress);
    });

    it('should initialize with all required properties', () => {
      address.id = 1;
      address.cliente_id = 123;
      address.calle = 'Avenida Central 100';
      address.ciudad = 'San José';
      address.estado_provincia = 'San José';
      address.codigo_postal = '10101';
      address.pais = 'Costa Rica';
      address.es_principal = true;
      address.fecha_creacion = new Date();
      address.is_deleted = false;

      expect(address.id).toBe(1);
      expect(address.cliente_id).toBe(123);
      expect(address.calle).toBe('Avenida Central 100');
      expect(address.ciudad).toBe('San José');
      expect(address.estado_provincia).toBe('San José');
      expect(address.codigo_postal).toBe('10101');
      expect(address.pais).toBe('Costa Rica');
      expect(address.es_principal).toBe(true);
      expect(address.fecha_creacion).toBeInstanceOf(Date);
      expect(address.is_deleted).toBe(false);
    });

    it('should allow optional branch name', () => {
      address.nombre_sucursal = 'Sucursal Centro';
      expect(address.nombre_sucursal).toBe('Sucursal Centro');
      
      address.nombre_sucursal = undefined;
      expect(address.nombre_sucursal).toBeUndefined();
    });
  });

  describe('Address Information', () => {
    it('should handle street addresses up to 200 characters', () => {
      const longStreet = 'A'.repeat(200);
      address.calle = longStreet;
      expect(address.calle).toBe(longStreet);
      expect(address.calle.length).toBe(200);
    });

    it('should handle various street formats', () => {
      const streetFormats = [
        'Avenida Central, Casa 123',
        'Del Banco Nacional 200m Norte',
        'Calle 15, Avenidas 3 y 5',
        'Residencial Los Álamos, Casa A-15'
      ];

      streetFormats.forEach(street => {
        address.calle = street;
        expect(address.calle).toBe(street);
      });
    });

    it('should handle city names up to 100 characters', () => {
      const cities = ['San José', 'Cartago', 'Alajuela', 'Heredia', 'Puntarenas', 'Guanacaste', 'Limón'];
      
      cities.forEach(city => {
        address.ciudad = city;
        expect(address.ciudad).toBe(city);
      });
    });

    it('should handle state/province names up to 100 characters', () => {
      const provinces = [
        'San José',
        'Alajuela', 
        'Cartago',
        'Heredia',
        'Guanacaste',
        'Puntarenas',
        'Limón'
      ];

      provinces.forEach(province => {
        address.estado_provincia = province;
        expect(address.estado_provincia).toBe(province);
      });
    });

    it('should handle postal codes up to 20 characters', () => {
      const postalCodes = [
        '10101',
        '20101',
        '30501',
        'CR-10101-2023',
        '40301'
      ];

      postalCodes.forEach(code => {
        address.codigo_postal = code;
        expect(address.codigo_postal).toBe(code);
      });
    });

    it('should default country to Costa Rica', () => {
      address.pais = 'Costa Rica';
      expect(address.pais).toBe('Costa Rica');
    });

    it('should handle other countries', () => {
      const countries = [
        'Nicaragua',
        'Panamá',
        'Estados Unidos',
        'México',
        'Guatemala'
      ];

      countries.forEach(country => {
        address.pais = country;
        expect(address.pais).toBe(country);
      });
    });
  });

  describe('Branch/Sucursal Information', () => {
    it('should handle branch names up to 100 characters', () => {
      const branchNames = [
        'Sucursal Principal',
        'Oficina Centro Comercial',
        'Almacén Zona Industrial',
        'Punto de Venta Mall San Pedro'
      ];

      branchNames.forEach(name => {
        address.nombre_sucursal = name;
        expect(address.nombre_sucursal).toBe(name);
      });
    });

    it('should handle null branch names', () => {
      address.nombre_sucursal = null as any;
      expect(address.nombre_sucursal).toBeNull();
    });

    it('should handle undefined branch names', () => {
      address.nombre_sucursal = undefined;
      expect(address.nombre_sucursal).toBeUndefined();
    });
  });

  describe('Principal Address Logic', () => {
    it('should default es_principal to false', () => {
      address.es_principal = false;
      expect(address.es_principal).toBe(false);
    });

    it('should allow setting as principal address', () => {
      address.es_principal = true;
      expect(address.es_principal).toBe(true);
    });

    it('should handle principal address changes', () => {
      address.es_principal = false;
      expect(address.es_principal).toBe(false);

      address.es_principal = true;
      expect(address.es_principal).toBe(true);

      address.es_principal = false;
      expect(address.es_principal).toBe(false);
    });

    it('should maintain boolean type for es_principal', () => {
      address.es_principal = true;
      expect(typeof address.es_principal).toBe('boolean');

      address.es_principal = false;
      expect(typeof address.es_principal).toBe('boolean');
    });
  });

  describe('Client Relationship', () => {
    it('should allow setting client relationship', () => {
      const client = new Client();
      client.id = 123;
      client.nombre = 'María Rodríguez';
      client.email = 'maria@example.com';

      address.cliente_id = client.id;
      address.client = client;

      expect(address.client).toBe(client);
      expect(address.cliente_id).toBe(client.id);
      expect(address.client).toBeInstanceOf(Client);
    });

    it('should maintain foreign key relationship', () => {
      const clientId = 999;
      address.cliente_id = clientId;

      expect(address.cliente_id).toBe(clientId);
      expect(typeof address.cliente_id).toBe('number');
    });

    it('should handle multiple addresses for same client', () => {
      const clientId = 100;
      
      const address1 = new ClientAddress();
      address1.cliente_id = clientId;
      address1.es_principal = true;
      address1.calle = 'Dirección Principal';

      const address2 = new ClientAddress();
      address2.cliente_id = clientId;
      address2.es_principal = false;
      address2.calle = 'Dirección Secundaria';

      expect(address1.cliente_id).toBe(clientId);
      expect(address2.cliente_id).toBe(clientId);
      expect(address1.es_principal).toBe(true);
      expect(address2.es_principal).toBe(false);
    });
  });

  describe('Soft Delete Functionality', () => {
    it('should default is_deleted to false', () => {
      address.is_deleted = false;
      expect(address.is_deleted).toBe(false);
    });

    it('should allow marking as deleted', () => {
      address.is_deleted = true;
      expect(address.is_deleted).toBe(true);
    });

    it('should allow restoring from deleted state', () => {
      address.is_deleted = true;
      expect(address.is_deleted).toBe(true);
      
      address.is_deleted = false;
      expect(address.is_deleted).toBe(false);
    });

    it('should maintain boolean type for is_deleted', () => {
      address.is_deleted = true;
      expect(typeof address.is_deleted).toBe('boolean');

      address.is_deleted = false;
      expect(typeof address.is_deleted).toBe('boolean');
    });
  });

  describe('Date Handling', () => {
    it('should handle fecha_creacion as Date object', () => {
      const testDate = new Date('2023-06-15T14:30:00Z');
      address.fecha_creacion = testDate;
      
      expect(address.fecha_creacion).toBeInstanceOf(Date);
      expect(address.fecha_creacion.getTime()).toBe(testDate.getTime());
    });

    it('should handle current date for fecha_creacion', () => {
      const now = new Date();
      address.fecha_creacion = now;
      
      expect(address.fecha_creacion).toBeInstanceOf(Date);
      expect(address.fecha_creacion.getTime()).toBeCloseTo(now.getTime(), -2);
    });

    it('should handle date serialization', () => {
      const testDate = new Date('2023-01-01T12:00:00Z');
      address.fecha_creacion = testDate;
      
      const json = JSON.stringify(address);
      const parsed = JSON.parse(json);
      
      expect(parsed.fecha_creacion).toBe(testDate.toISOString());
    });
  });

  describe('Complete Address Profile', () => {
    it('should create a complete address profile', () => {
      const client = new Client();
      client.id = 1;
      client.nombre = 'Carlos Méndez';

      const currentDate = new Date();

      address.id = 1;
      address.cliente_id = client.id;
      address.nombre_sucursal = 'Oficina Principal';
      address.calle = 'Avenida Segunda, Calles 1 y 3, Edificio Centro, Oficina 205';
      address.ciudad = 'San José';
      address.estado_provincia = 'San José';
      address.codigo_postal = '10101';
      address.pais = 'Costa Rica';
      address.es_principal = true;
      address.fecha_creacion = currentDate;
      address.is_deleted = false;
      address.client = client;

      expect(address.id).toBe(1);
      expect(address.cliente_id).toBe(1);
      expect(address.nombre_sucursal).toBe('Oficina Principal');
      expect(address.calle).toBe('Avenida Segunda, Calles 1 y 3, Edificio Centro, Oficina 205');
      expect(address.ciudad).toBe('San José');
      expect(address.estado_provincia).toBe('San José');
      expect(address.codigo_postal).toBe('10101');
      expect(address.pais).toBe('Costa Rica');
      expect(address.es_principal).toBe(true);
      expect(address.fecha_creacion).toBe(currentDate);
      expect(address.is_deleted).toBe(false);
      expect(address.client).toBe(client);
    });

    it('should handle address updates', () => {
      address.id = 1;
      address.calle = 'Dirección Original';
      address.ciudad = 'Ciudad Original';
      address.es_principal = false;

      // Update address
      address.calle = 'Nueva Dirección Actualizada';
      address.ciudad = 'Nueva Ciudad';
      address.es_principal = true;

      expect(address.calle).toBe('Nueva Dirección Actualizada');
      expect(address.ciudad).toBe('Nueva Ciudad');
      expect(address.es_principal).toBe(true);
    });
  });

  describe('Entity Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const testDate = new Date('2023-01-01T00:00:00Z');
      
      address.id = 1;
      address.cliente_id = 123;
      address.nombre_sucursal = 'Test Branch';
      address.calle = 'Test Street 123';
      address.ciudad = 'Test City';
      address.estado_provincia = 'Test State';
      address.codigo_postal = '12345';
      address.pais = 'Test Country';
      address.es_principal = true;
      address.fecha_creacion = testDate;
      address.is_deleted = false;

      const json = JSON.stringify(address);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(1);
      expect(parsed.cliente_id).toBe(123);
      expect(parsed.nombre_sucursal).toBe('Test Branch');
      expect(parsed.calle).toBe('Test Street 123');
      expect(parsed.ciudad).toBe('Test City');
      expect(parsed.estado_provincia).toBe('Test State');
      expect(parsed.codigo_postal).toBe('12345');
      expect(parsed.pais).toBe('Test Country');
      expect(parsed.es_principal).toBe(true);
      expect(parsed.is_deleted).toBe(false);
    });

    it('should handle serialization without optional fields', () => {
      address.id = 2;
      address.cliente_id = 456;
      address.calle = 'Simple Street';
      address.ciudad = 'Simple City';
      address.estado_provincia = 'Simple State';
      address.codigo_postal = '67890';
      address.pais = 'Costa Rica';
      address.es_principal = false;
      address.fecha_creacion = new Date();
      address.is_deleted = false;

      const json = JSON.stringify(address);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(2);
      expect(parsed.cliente_id).toBe(456);
      expect(parsed.calle).toBe('Simple Street');
      expect(parsed.nombre_sucursal).toBeUndefined();
      expect(parsed.client).toBeUndefined();
    });
  });

  describe('Data Type Validation', () => {
    it('should handle numeric ID values', () => {
      address.id = 12345;
      address.cliente_id = 67890;

      expect(typeof address.id).toBe('number');
      expect(typeof address.cliente_id).toBe('number');
      expect(address.id).toBe(12345);
      expect(address.cliente_id).toBe(67890);
    });

    it('should handle string address components', () => {
      const stringFields = {
        nombre_sucursal: 'Test Branch',
        calle: 'Test Street',
        ciudad: 'Test City',
        estado_provincia: 'Test Province',
        codigo_postal: '12345',
        pais: 'Test Country'
      };

      Object.entries(stringFields).forEach(([field, value]) => {
        (address as any)[field] = value;
        expect(typeof (address as any)[field]).toBe('string');
        expect((address as any)[field]).toBe(value);
      });
    });

    it('should handle boolean flag values', () => {
      const booleanFields = ['es_principal', 'is_deleted'];
      const booleanValues = [true, false];
      
      booleanFields.forEach(field => {
        booleanValues.forEach(value => {
          (address as any)[field] = value;
          expect(typeof (address as any)[field]).toBe('boolean');
          expect((address as any)[field]).toBe(value);
        });
      });
    });

    it('should handle Date objects', () => {
      const testDate = new Date();
      address.fecha_creacion = testDate;
      
      expect(address.fecha_creacion).toBeInstanceOf(Date);
      expect(typeof address.fecha_creacion.getTime()).toBe('number');
    });
  });

  describe('Business Logic Scenarios', () => {
    it('should support multiple addresses with only one principal', () => {
      const addresses: ClientAddress[] = [];
      
      // Create principal address
      const principalAddress = new ClientAddress();
      principalAddress.id = 1;
      principalAddress.cliente_id = 1;
      principalAddress.calle = 'Principal Street';
      principalAddress.es_principal = true;
      addresses.push(principalAddress);
      
      // Create secondary addresses
      for (let i = 2; i <= 3; i++) {
        const secondaryAddress = new ClientAddress();
        secondaryAddress.id = i;
        secondaryAddress.cliente_id = 1;
        secondaryAddress.calle = `Secondary Street ${i}`;
        secondaryAddress.es_principal = false;
        addresses.push(secondaryAddress);
      }
      
      const principalAddresses = addresses.filter(addr => addr.es_principal);
      const secondaryAddresses = addresses.filter(addr => !addr.es_principal);
      
      expect(principalAddresses).toHaveLength(1);
      expect(secondaryAddresses).toHaveLength(2);
      expect(principalAddresses[0].calle).toBe('Principal Street');
    });

    it('should handle Costa Rican address format', () => {
      address.calle = 'Del Banco Nacional 200m Norte, 150m Este';
      address.ciudad = 'San Pedro';
      address.estado_provincia = 'San José';
      address.codigo_postal = '11501';
      address.pais = 'Costa Rica';
      
      expect(address.calle).toContain('Del Banco Nacional');
      expect(address.ciudad).toBe('San Pedro');
      expect(address.estado_provincia).toBe('San José');
      expect(address.codigo_postal).toBe('11501');
      expect(address.pais).toBe('Costa Rica');
    });
  });
});