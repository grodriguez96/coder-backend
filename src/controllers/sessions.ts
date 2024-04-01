import { NextFunction, Request, Response } from 'express';

class SessionsController {
  public register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return res.success201('Registered!');
    } catch (error) {
      return next(error);
    }
  };
  public login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return res
        .cookie('token', req.token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .success200('Logged in!');
    } catch (error) {
      return next(error);
    }
  };
  public google = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return res.success200('Logged in with Google!');
    } catch (error) {
      return next(error);
    }
  };
  public me = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, role, photo, name, _id: id, lastName } = req.user;

      return res.success200({ email, role, photo, name, _id: id, lastName });
    } catch (error) {
      return next(error);
    }
  };
  public signout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return res.clearCookie('token').success200('Signed out!');
    } catch (error) {
      return next(error);
    }
  };
  public badauth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return res.error401();
    } catch (error) {
      return next(error);
    }
  };
}

export default SessionsController;
const controller = new SessionsController();
const { register, login, google, me, signout, badauth } = controller;
export { register, login, google, me, signout, badauth };
