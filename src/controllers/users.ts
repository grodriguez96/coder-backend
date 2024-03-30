import type { NextFunction, Request, Response } from 'express';
import service, { UserServiceInterface } from '../services/users';
import { FilterQuery, PaginateOptions } from 'mongoose';
import { User } from '../dto/user';

class UserController {
  service: UserServiceInterface;

  constructor() {
    this.service = service;
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = req.body;
      const response = await this.service.create(data);
      return res.success201(response);
    } catch (error) {
      return next(error);
    }
  };
  public read = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const options: PaginateOptions = {
        limit: +(req.query.limit as string) || 8,
        page: +(req.query.page as string) || 1,
        sort: { title: req.query.sort === 'desc' ? 'desc' : 1 },
        lean: true,
      };
      const filter: FilterQuery<User> = {};
      const all = await this.service.read({ filter, options });
      return res.success200(all);
    } catch (error) {
      return next(error);
    }
  };
  public readOne = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { eid } = req.params;
      const one = await this.service.readOne(eid);
      return res.success200(one);
    } catch (error) {
      return next(error);
    }
  };
  public update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { eid } = req.params;
      const data = req.body;
      const response = await this.service.update(eid, data);
      return res.success200(response);
    } catch (error) {
      return next(error);
    }
  };
  public destroy = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { eid } = req.params;
      const response = await this.service.destroy(eid);
      return res.success200(response);
    } catch (error) {
      return next(error);
    }
  };
}

export default UserController;
const controller = new UserController();
const { create, read, readOne, update, destroy } = controller;
export { create, read, readOne, update, destroy };
