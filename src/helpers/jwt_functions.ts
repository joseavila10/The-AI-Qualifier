import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwt_duration_hours = process.env.JWT_EXPIRES_IN_HOURS;
const jwtSecretKeyLength = 128;

export const generateToken = (payload: object) => {
    if (!jwtSecretKey || typeof jwtSecretKey !== 'string' || jwtSecretKey.length !== jwtSecretKeyLength) {
        throw new Error(`jwtSecretKey_KEY must be a ${jwtSecretKeyLength}-byte string`);
    }

    if (!jwt_duration_hours || typeof jwt_duration_hours !== 'string') {
        throw new Error(`jwt_duration_hours is invalid`);
    }
  
    if (!jwt_duration_hours || isNaN(Number(jwt_duration_hours))) {
        throw new Error(`jwt_duration_hours is invalid or not a number`);
    }

    const expiresIn = `${jwt_duration_hours}h`;
  
    // @ts-ignore - Ignore the TypeScript error here
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn });

    return token;
};
