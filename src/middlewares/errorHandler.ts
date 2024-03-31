import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface CustomError extends Error {
  statusCode: number;
}

export default (error: CustomError, req: Request, res: Response, next: NextFunction): Response => {
  console.error({ err: error });
  return res.json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    url: `${req.method} ${req.url}`,
    message: error.message,
  });
};
