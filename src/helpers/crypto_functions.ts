import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SECRET_KEY = process.env.ENCRYPTATION_SECRET_KEY; 
const secretKeyLength = 32;
const IV_LENGTH = 16;

export const encrypt = (text: string) => {
    if (!SECRET_KEY || typeof SECRET_KEY !== 'string' || SECRET_KEY.length !== secretKeyLength) {
        throw new Error(`ENCRYPTATION_SECRET_KEY must be a ${secretKeyLength}-byte string`);
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'utf-8'), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText: string) => {
    if (!SECRET_KEY || typeof SECRET_KEY !== 'string' || SECRET_KEY.length !== secretKeyLength) {
        throw new Error(`ENCRYPTATION_SECRET_KEY must be a ${secretKeyLength}-byte string`);
    }

    const textParts = encryptedText.split(':');
  
    if (textParts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
  
    const ivString = textParts.shift();
    if (!ivString) {
      throw new Error('IV is missing or invalid');
    }
  
    const iv = Buffer.from(ivString, 'hex');
    const encryptedData = textParts.join(':');
  
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'utf-8'), iv);
  
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
  };