// Test setup and utilities for entity tests
export const testUtils = {
  // Helper function to create a valid date
  createTestDate: (dateString?: string): Date => {
    return dateString ? new Date(dateString) : new Date();
  },

  // Helper function to create mock data
  createMockClient: (overrides: any = {}) => {
    return {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      telefono: '1234567890',
      fecha_registro: new Date(),
      isDeleted: false,
      ...overrides
    };
  },

  createMockClientPreferences: (overrides: any = {}) => {
    return {
      id: 1,
      cliente_id: 1,
      idioma: 'es',
      notificaciones_email: true,
      notificaciones_push: false,
      ...overrides
    };
  },

  createMockClientAddress: (overrides: any = {}) => {
    return {
      id: 1,
      cliente_id: 1,
      calle: 'Test Street 123',
      ciudad: 'Test City',
      estado_provincia: 'Test Province',
      codigo_postal: '12345',
      pais: 'Costa Rica',
      es_principal: false,
      fecha_creacion: new Date(),
      is_deleted: false,
      ...overrides
    };
  },

  // Validation helpers
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhoneNumber: (phone: string): boolean => {
    return phone.length <= 20;
  },

  validatePostalCode: (code: string): boolean => {
    return code.length <= 20;
  },

  // Common test data
  testEmails: [
    'valid@example.com',
    'user.name@domain.co.cr',
    'test+tag@company.org'
  ],

  testPhoneNumbers: [
    '1234567890',
    '+506 8888-9999',
    '(506) 2222-3333'
  ],

  costaRicanProvinces: [
    'San José',
    'Alajuela', 
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón'
  ],

  testLanguages: ['es', 'en', 'fr', 'de', 'it'],

  testCountries: [
    'Costa Rica',
    'Nicaragua',
    'Panamá',
    'Estados Unidos',
    'México'
  ]
};