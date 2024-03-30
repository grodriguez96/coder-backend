import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export default (req: Request, res: Response, next: NextFunction): Response => {
  console.error(`${req.method} ${req.url} Not found path`);
  return res.json({
    statusCode: StatusCodes.NOT_FOUND,
    url: `${req.method} ${req.url}`,
    message: `Not found path`,
  });
};
