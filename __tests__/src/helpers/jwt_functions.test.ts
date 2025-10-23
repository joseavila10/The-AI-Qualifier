process.env.JWT_SECRET_KEY = 'a'.repeat(128);

import jwt from 'jsonwebtoken';
import * as jwtFunctions from '../../../src/helpers/jwt_functions';

const originalEnv = { ...process.env };

describe('generateToken', () => {
  const validSecretKey = 'a'.repeat(128);
  const validDuration = '2';

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      JWT_SECRET_KEY: validSecretKey,
      JWT_EXPIRES_IN_HOURS: validDuration,
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('generates a valid JWT token string', () => {
    const payload = { data: 'test' };
    const token = jwtFunctions.generateToken(payload);
    expect(typeof token).toBe('string');

    // verify token with same options
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    expect((decoded as any).data).toBe('test');
  });

  test('throws if JWT_SECRET_KEY is missing', async() => {
    process.env.JWT_SECRET_KEY = undefined;
    process.env.JWT_EXPIRES_IN_HOURS = '2';

    jest.resetModules();

    const { generateToken } = await import('../../../src/helpers/jwt_functions');

    expect(() => generateToken({})).toThrow('jwtSecretKey_KEY must be a 128-byte string');
  });

  test('throws if JWT_SECRET_KEY is too short', async() => {
    process.env.JWT_SECRET_KEY = 'short';
    process.env.JWT_EXPIRES_IN_HOURS = '2';

    jest.resetModules();

    const { generateToken } = await import('../../../src/helpers/jwt_functions');
    expect(() => generateToken({})).toThrow();
  });

  test('throws if JWT_EXPIRES_IN_HOURS is missing', async() => {
    process.env.JWT_SECRET_KEY = 'a'.repeat(128);
    process.env.JWT_EXPIRES_IN_HOURS = undefined;
    jest.resetModules();

    const { generateToken } = await import('../../../src/helpers/jwt_functions');
    expect(() => generateToken({})).toThrow('jwt_duration_hours is invalid');
  });

  test('throws if JWT_EXPIRES_IN_HOURS is not a number', async() => {
    process.env.JWT_SECRET_KEY = 'a'.repeat(128);
    process.env.JWT_EXPIRES_IN_HOURS = 'abcd';
    jest.resetModules();

    const { generateToken } = await import('../../../src/helpers/jwt_functions');
    expect(() => generateToken({})).toThrow('jwt_duration_hours is invalid or not a number');
  });
});
