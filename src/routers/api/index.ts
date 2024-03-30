import CustomRouter from '../CustomRouter';
import usersRouter from './users';
import productsRouter from './products';
import ordersRouter from './orders';
import sessionsRouter from './sessions';

class ApiRouter extends CustomRouter {
  init() {
    this.use('/users', usersRouter);
    this.use('/products', productsRouter);
    this.use('/orders', ordersRouter);
    this.use('/sessions', sessionsRouter);
  }
}

const { router } = new ApiRouter();
export default router;
