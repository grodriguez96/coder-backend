import type { NextFunction, Request, Response } from 'express';
import type { CustomError } from './errorHandler';
import type { User } from '../dto/user';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';

export default (strategy: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(strategy, (error: CustomError, user: User, info: any) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.json({
          statusCode: info.statusCode || StatusCodes.UNAUTHORIZED,
          message: info.message || info.toString(),
        });
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
};
