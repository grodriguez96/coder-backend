import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dao from '../data/index.factory';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import env from '../utils/env';
import Roles from '../enums/roles';

class CustomRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this.init();
  }

  public init() {}

  public get router() {
    return this._router;
  }

  private applyCbs(cbs: any[]): any[] {
    return cbs.map((each) => async (...params: any[]) => {
      try {
        await each.apply(this, params);
      } catch (error: any) {
        console.log('EnreeeeeeeeYS');
        params[1].json({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      }
    });
  }

  private responses = (req: Request, res: Response, next: NextFunction): void => {
    res.success200 = (payload: any): Res => res.json({ statusCode: StatusCodes.OK, response: payload });
    res.success201 = (payload: any): Res => res.json({ statusCode: StatusCodes.CREATED, response: payload });
    res.error400 = (message: string): Res => res.json({ statusCode: StatusCodes.BAD_REQUEST, message });
    res.error401 = (): Res => res.json({ statusCode: StatusCodes.UNAUTHORIZED, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
    res.error403 = (): Res => res.json({ statusCode: StatusCodes.FORBIDDEN, message: getReasonPhrase(StatusCodes.FORBIDDEN) });
    res.error404 = (): Res => res.json({ statusCode: StatusCodes.NOT_FOUND, message: getReasonPhrase(StatusCodes.NOT_FOUND) });
    return next();
  };

  private policies =
    (arrayOfPolicies: Roles[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void | Record<string, any>> => {
      try {
        if (!arrayOfPolicies.length) return next();
        let token = req.cookies['token'];
        if (!token) return res.error401();
        else {
          const data = jwt.verify(token, env.SECRET);
          if (!data) return res.error400('Bad auth by token');
          else {
            const { email, role } = data as jwt.JwtPayload;
            if (arrayOfPolicies.includes(role)) {
              const user = await dao.users.readByEmail(email);
              req.user = user;
              return next();
            } else return res.error403();
          }
        }
      } catch (error) {
        return next(error);
      }
    };
  create(path: string, policies: Roles[], ...cbs: any[]): void {
    this.router.post(path, this.responses, this.policies(policies), this.applyCbs(cbs));
  }
  read(path: string, policies: Roles[], ...cbs: any[]): void {
    this.router.get(path, this.responses, this.policies(policies), this.applyCbs(cbs));
  }
  update(path: string, policies: Roles[], ...cbs: any[]): void {
    this.router.put(path, this.responses, this.policies(policies), this.applyCbs(cbs));
  }
  destroy(path: string, policies: Roles[], ...cbs: any[]): void {
    this.router.delete(path, this.responses, this.policies(policies), this.applyCbs(cbs));
  }
  use(path: string, ...cbs: any[]): void {
    this.router.use(path, this.responses, this.applyCbs(cbs));
  }
}

export default CustomRouter;
