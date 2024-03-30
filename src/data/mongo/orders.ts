import MongoManager from './manager';
import Orders from './models/orders';

const orders = new MongoManager(Orders);
export default orders;
