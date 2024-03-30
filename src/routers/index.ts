import CustomRouter from './CustomRouter';
import apiRouter from './api/index';

class IndexRouter extends CustomRouter {
  init() {
    this.router.use('/api', apiRouter);
  }
}

export default IndexRouter;
