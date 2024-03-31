import FsManager from './manager';
import { PaginateModel, Types } from 'mongoose';
import Model from './model';
import OrderDTO from '../../dto/order';

const schema = {
  productId: { type: String, required: true, ref: 'products' },
  userId: { type: String, required: true, ref: 'users' },
  quantity: { type: Number, required: true },
  state: { type: Number },
};

const model = new Model('./src/data/fs/files', 'orders', schema) as unknown as PaginateModel<OrderDTO>;
const orders = new FsManager(model);
export default orders;
