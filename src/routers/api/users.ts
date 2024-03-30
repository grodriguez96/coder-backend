import CustomRouter from '../CustomRouter';
import { create, read, readOne, update, destroy } from '../../controllers/users';
import Roles from '../../enums/roles';

class UsersRouter extends CustomRouter {
  init() {
    this.create('/', [], create);
    this.read('/', [Roles.Admin], read);
    this.read('/:uid', [Roles.User, Roles.Prem], readOne);
    this.update('/:uid', [Roles.User, Roles.Prem], update);
    this.destroy('/:uid', [Roles.User, Roles.Prem], destroy);
  }
}

const { router } = new UsersRouter();
export default router;
