import ProductDTO from '../../dto/product';
import FsManager from './manager';
import { PaginateModel } from 'mongoose';
import Model from './model';

const schema = {
  title: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
};

const model = new Model('./src/data/fs/files', 'products', schema) as unknown as PaginateModel<ProductDTO>;
const products = new FsManager(model);
export default products;
