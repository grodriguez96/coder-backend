import CustomRouter from '../CustomRouter.js';
import passport from '../../middlewares/passport';
import passCallBack from '../../middlewares/passCallBack';
import { register, login, google, me, signout, badauth } from '../../controllers/sessions';
import Roles from '../../enums/roles.js';

class SessionsRouter extends CustomRouter {
  init() {
    this.create('/register', [], passCallBack('register'), register);
    this.create('/login', [], passCallBack('login'), login);
    this.create('/google', [], passport.authenticate('google', { scope: ['email', 'profile'] }));
    this.read(
      '/google/callback',
      [],
      passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/sessions/badauth',
      }),
      google
    );
    this.create('/', [Roles.User, Roles.Admin, Roles.Prem], me);
    this.create('/signout', [Roles.User, Roles.Admin, Roles.Prem], signout);
    this.read('/badauth', [], badauth);
  }
}

const { router } = new SessionsRouter();
export default router;
