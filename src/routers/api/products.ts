import CustomRouter from '../CustomRouter';
import { create, read, readOne, update, destroy } from '../../controllers/products';
import Roles from '../../enums/roles';

class ProductsRouter extends CustomRouter {
  init() {
    this.create('/', [Roles.Admin, Roles.Prem], create);
    this.read('/', [], read);
    this.read('/:eid', [], readOne);
    this.update('/:eid', [Roles.Admin, Roles.Prem], update);
    this.destroy('/:eid', [Roles.Admin, Roles.Prem], destroy);
  }
}

const { router } = new ProductsRouter();
export default router;
