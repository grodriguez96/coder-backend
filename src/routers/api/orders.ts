import CustomRouter from '../CustomRouter';
import { create, read, readOne, update, destroy } from '../../controllers/orders';
import Roles from '../../enums/roles';

class OrdersRouter extends CustomRouter {
  init() {
    this.create('/', [Roles.User, Roles.Prem], create);
    this.read('/', [Roles.User, Roles.Prem], read);
    this.read('/:eid', [Roles.User, Roles.Prem], readOne);
    this.update('/:eid', [Roles.User, Roles.Prem], update);
    this.destroy('/:eid', [Roles.User, Roles.Prem], destroy);
  }
}

const { router } = new OrdersRouter();
export default router;
