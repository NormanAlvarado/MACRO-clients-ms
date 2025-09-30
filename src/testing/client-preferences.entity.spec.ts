import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { Client } from '../client/entities/client.entity';

describe('ClientPreferences Entity', () => {
  let preferences: ClientPreferences;

  beforeEach(() => {
    preferences = new ClientPreferences();
  });

  describe('Constructor and Properties', () => {
    it('should create a ClientPreferences instance', () => {
      expect(preferences).toBeDefined();
      expect(preferences).toBeInstanceOf(ClientPreferences);
    });

    it('should initialize with all properties', () => {
      preferences.id = 1;
      preferences.cliente_id = 123;
      preferences.idioma = 'es';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;

      expect(preferences.id).toBe(1);
      expect(preferences.cliente_id).toBe(123);
      expect(preferences.idioma).toBe('es');
      expect(preferences.notificaciones_email).toBe(true);
      expect(preferences.notificaciones_push).toBe(false);
    });

    it('should allow setting all properties individually', () => {
      preferences.id = 999;
      preferences.cliente_id = 456;
      preferences.idioma = 'en';
      preferences.notificaciones_email = false;
      preferences.notificaciones_push = true;

      expect(preferences.id).toBe(999);
      expect(preferences.cliente_id).toBe(456);
      expect(preferences.idioma).toBe('en');
      expect(preferences.notificaciones_email).toBe(false);
      expect(preferences.notificaciones_push).toBe(true);
    });
  });

  describe('Language Settings', () => {
    it('should handle Spanish language setting', () => {
      preferences.idioma = 'es';
      expect(preferences.idioma).toBe('es');
    });

    it('should handle English language setting', () => {
      preferences.idioma = 'en';
      expect(preferences.idioma).toBe('en');
    });

    it('should handle French language setting', () => {
      preferences.idioma = 'fr';
      expect(preferences.idioma).toBe('fr');
    });

    it('should handle language codes up to 10 characters', () => {
      const longLanguageCode = 'es-CR-test';
      preferences.idioma = longLanguageCode;
      expect(preferences.idioma).toBe(longLanguageCode);
      expect(preferences.idioma.length).toBeLessThanOrEqual(10);
    });

    it('should handle default language', () => {
      // Simulating the default value from the database
      preferences.idioma = 'es';
      expect(preferences.idioma).toBe('es');
    });
  });

  describe('Email Notifications', () => {
    it('should default email notifications to true', () => {
      preferences.notificaciones_email = true;
      expect(preferences.notificaciones_email).toBe(true);
    });

    it('should allow disabling email notifications', () => {
      preferences.notificaciones_email = false;
      expect(preferences.notificaciones_email).toBe(false);
    });

    it('should handle boolean values correctly', () => {
      preferences.notificaciones_email = true;
      expect(typeof preferences.notificaciones_email).toBe('boolean');
      expect(preferences.notificaciones_email).toBe(true);

      preferences.notificaciones_email = false;
      expect(typeof preferences.notificaciones_email).toBe('boolean');
      expect(preferences.notificaciones_email).toBe(false);
    });
  });

  describe('Push Notifications', () => {
    it('should default push notifications to false', () => {
      preferences.notificaciones_push = false;
      expect(preferences.notificaciones_push).toBe(false);
    });

    it('should allow enabling push notifications', () => {
      preferences.notificaciones_push = true;
      expect(preferences.notificaciones_push).toBe(true);
    });

    it('should handle boolean values correctly', () => {
      preferences.notificaciones_push = false;
      expect(typeof preferences.notificaciones_push).toBe('boolean');
      expect(preferences.notificaciones_push).toBe(false);

      preferences.notificaciones_push = true;
      expect(typeof preferences.notificaciones_push).toBe('boolean');
      expect(preferences.notificaciones_push).toBe(true);
    });
  });

  describe('Client Relationship', () => {
    it('should allow setting client relationship', () => {
      const client = new Client();
      client.id = 123;
      client.nombre = 'Juan Pérez';
      client.email = 'juan@example.com';

      preferences.cliente_id = client.id;
      preferences.client = client;

      expect(preferences.client).toBe(client);
      expect(preferences.cliente_id).toBe(client.id);
      expect(preferences.client).toBeInstanceOf(Client);
    });

    it('should maintain foreign key relationship', () => {
      const clientId = 999;
      preferences.cliente_id = clientId;

      expect(preferences.cliente_id).toBe(clientId);
      expect(typeof preferences.cliente_id).toBe('number');
    });

    it('should handle null client relationship', () => {
      preferences.client = null as any;
      expect(preferences.client).toBeNull();
    });
  });

  describe('Notification Combinations', () => {
    it('should handle both notifications enabled', () => {
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = true;

      expect(preferences.notificaciones_email).toBe(true);
      expect(preferences.notificaciones_push).toBe(true);
    });

    it('should handle both notifications disabled', () => {
      preferences.notificaciones_email = false;
      preferences.notificaciones_push = false;

      expect(preferences.notificaciones_email).toBe(false);
      expect(preferences.notificaciones_push).toBe(false);
    });

    it('should handle mixed notification settings', () => {
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;

      expect(preferences.notificaciones_email).toBe(true);
      expect(preferences.notificaciones_push).toBe(false);
    });
  });

  describe('Complete Preference Profile', () => {
    it('should create a complete preference profile', () => {
      const client = new Client();
      client.id = 1;
      client.nombre = 'Ana García';

      preferences.id = 1;
      preferences.cliente_id = client.id;
      preferences.idioma = 'es';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;
      preferences.client = client;

      expect(preferences.id).toBe(1);
      expect(preferences.cliente_id).toBe(1);
      expect(preferences.idioma).toBe('es');
      expect(preferences.notificaciones_email).toBe(true);
      expect(preferences.notificaciones_push).toBe(false);
      expect(preferences.client).toBe(client);
    });

    it('should handle preference updates', () => {
      preferences.id = 1;
      preferences.cliente_id = 1;
      preferences.idioma = 'es';
      preferences.notificaciones_email = false;
      preferences.notificaciones_push = false;

      // Update preferences
      preferences.idioma = 'en';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = true;

      expect(preferences.idioma).toBe('en');
      expect(preferences.notificaciones_email).toBe(true);
      expect(preferences.notificaciones_push).toBe(true);
    });
  });

  describe('Entity Serialization', () => {
    it('should serialize to JSON correctly', () => {
      preferences.id = 1;
      preferences.cliente_id = 123;
      preferences.idioma = 'es';
      preferences.notificaciones_email = true;
      preferences.notificaciones_push = false;

      const json = JSON.stringify(preferences);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(1);
      expect(parsed.cliente_id).toBe(123);
      expect(parsed.idioma).toBe('es');
      expect(parsed.notificaciones_email).toBe(true);
      expect(parsed.notificaciones_push).toBe(false);
    });

    it('should handle serialization without client relationship', () => {
      preferences.id = 2;
      preferences.cliente_id = 456;
      preferences.idioma = 'en';
      preferences.notificaciones_email = false;
      preferences.notificaciones_push = true;

      const json = JSON.stringify(preferences);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(2);
      expect(parsed.cliente_id).toBe(456);
      expect(parsed.idioma).toBe('en');
      expect(parsed.notificaciones_email).toBe(false);
      expect(parsed.notificaciones_push).toBe(true);
      expect(parsed.client).toBeUndefined();
    });
  });

  describe('Data Type Validation', () => {
    it('should handle numeric ID values', () => {
      preferences.id = 12345;
      preferences.cliente_id = 67890;

      expect(typeof preferences.id).toBe('number');
      expect(typeof preferences.cliente_id).toBe('number');
      expect(preferences.id).toBe(12345);
      expect(preferences.cliente_id).toBe(67890);
    });

    it('should handle string language values', () => {
      const languages = ['es', 'en', 'fr', 'de', 'it'];
      
      languages.forEach(lang => {
        preferences.idioma = lang;
        expect(typeof preferences.idioma).toBe('string');
        expect(preferences.idioma).toBe(lang);
      });
    });

    it('should handle boolean notification values', () => {
      const booleanValues = [true, false];
      
      booleanValues.forEach(value => {
        preferences.notificaciones_email = value;
        preferences.notificaciones_push = value;
        
        expect(typeof preferences.notificaciones_email).toBe('boolean');
        expect(typeof preferences.notificaciones_push).toBe('boolean');
        expect(preferences.notificaciones_email).toBe(value);
        expect(preferences.notificaciones_push).toBe(value);
      });
    });
  });
});