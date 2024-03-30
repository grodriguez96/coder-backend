import type { CustomError } from '../middlewares/errorHandler';
import jwt from 'jsonwebtoken';
import env from './env';
import { StatusCodes } from 'http-status-codes';

const ONE_WEEK = 60 * 60 * 24 * 7;

function createToken(data: Record<string, any>): string {
  const token = jwt.sign(data, env.SECRET, {
    expiresIn: ONE_WEEK,
  });
  return token;
}

function verifytoken(token?: string): string | jwt.JwtPayload {
  if (token) {
    return jwt.verify(token, env.SECRET);
  }
  const error = new Error('bad auth token') as CustomError;
  error.statusCode = StatusCodes.UNAUTHORIZED;
  throw error;
}

export { createToken, verifytoken };
