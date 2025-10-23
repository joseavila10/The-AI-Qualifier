import { hashPassword, checkPassword } from '../../../src/helpers/bcrypt_functions';
import bcrypt from 'bcrypt';

describe('Password Utils', () => {
  const plainPassword = 'MySecret123!';

  it('hashPassword should return a hashed string different from plain password', async () => {
    const hashed = await hashPassword(plainPassword);
    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(plainPassword);
  });

  it('checkPassword returns true if passwords match', async () => {
    const hashed = await hashPassword(plainPassword);
    const result = await checkPassword(plainPassword, hashed);
    expect(result).toBe(true);
  });

  it('checkPassword returns false if passwords do not match', async () => {
    const hashed = await hashPassword(plainPassword);
    const result = await checkPassword('wrongPassword', hashed);
    expect(result).toBe(false);
  });

  it('checkPassword returns false if bcrypt.compare throws', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
      throw new Error('Mock error');
    });

    const result = await checkPassword(plainPassword, 'anyHash');
    expect(result).toBe(false);

    jest.spyOn(bcrypt, 'compare').mockRestore();
  });
});
