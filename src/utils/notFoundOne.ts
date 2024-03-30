import type { CustomError } from '../middlewares/errorHandler';
import { FlattenMaps, Document } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export default function <T>(one: FlattenMaps<T> | Document | null): void {
  if (!one) {
    const error = new Error("There isn't any document") as CustomError;
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
}
