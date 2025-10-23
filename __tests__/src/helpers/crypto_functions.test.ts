process.env.ENCRYPTATION_SECRET_KEY = 'a'.repeat(32);

import * as cryptoFuncs from '../../../src/helpers/crypto_functions';

// Mock process.env for the tests
const originalEnv = process.env;

describe('encrypt/decrypt functions', () => {
  const validSecretKey = 'a'.repeat(32); // exactly 32 characters
  const invalidSecretKey = 'short_key';

  beforeEach(() => {
    jest.resetModules(); // Clear module cache
    process.env = { ...originalEnv, ENCRYPTATION_SECRET_KEY: validSecretKey };
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original env
  });

  test('encrypt and decrypt should return original text', () => {
    const text = 'Hello World!';

    const encrypted = cryptoFuncs.encrypt(text);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).toContain(':');

    const decrypted = cryptoFuncs.decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  test('encrypt throws error if SECRET_KEY is missing', () => {
    process.env.ENCRYPTATION_SECRET_KEY = undefined;

    jest.isolateModules(() => {
      const { encrypt } = require('../../../src/helpers/crypto_functions');
      expect(() => encrypt('test')).toThrowError(
        'ENCRYPTATION_SECRET_KEY must be a 32-byte string'
      );
    });
  });

  test('encrypt throws error if SECRET_KEY length is not 32', () => {
    process.env.ENCRYPTATION_SECRET_KEY = invalidSecretKey;

    jest.isolateModules(() => {
      const { encrypt } = require('../../../src/helpers/crypto_functions');
      expect(() => encrypt('test')).toThrowError(
        'ENCRYPTATION_SECRET_KEY must be a 32-byte string'
      );
    });
  });

  test('decrypt throws error if SECRET_KEY is missing', () => {
    process.env.ENCRYPTATION_SECRET_KEY = undefined;

    jest.isolateModules(() => {
      const { decrypt } = require('../../../src/helpers/crypto_functions');
      expect(() => decrypt('any:thing')).toThrowError(
        'ENCRYPTATION_SECRET_KEY must be a 32-byte string'
      );
    });
  });

  test('decrypt throws error if SECRET_KEY length is not 32', () => {
    process.env.ENCRYPTATION_SECRET_KEY = invalidSecretKey;

    jest.isolateModules(() => {
      const { decrypt } = require('../../../src/helpers/crypto_functions');
      expect(() => decrypt('any:thing')).toThrowError(
        'ENCRYPTATION_SECRET_KEY must be a 32-byte string'
      );
    });
  });

  test('decrypt throws error on invalid encrypted text format (no colon)', () => {
    const encryptedText = 'invalidEncryptedTextWithoutColon';
    expect(() => cryptoFuncs.decrypt(encryptedText)).toThrowError('Invalid encrypted text format');
  });

  test('decrypt throws error if IV is missing or invalid', () => {
    const encryptedText = ':encryptedData';
    expect(() => cryptoFuncs.decrypt(encryptedText)).toThrowError('IV is missing or invalid');
  });
});
