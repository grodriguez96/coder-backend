import type { Order } from '../dto/order';
import type { Product } from '../dto/product';
import type { User } from '../dto/user';
import type { Manager } from '../interfaces/manager';
import argsUtil from '../utils/args';
import dbConnection from '../utils/dbConnection';

type Factory = {
  products: Manager<Product>;
  users: Manager<User>;
  orders: Manager<Order>;
};

const factory: Factory = Object.create({});

const data = {
  // test: {
  //   paths: ['./memory/products', './memory/users', './memory/orders'],
  //   cb: () => console.log('MEMORY CONNECTED'),
  // },
  // dev: {
  //   paths: ['./fs/products', './fs/users', './fs/orders'],
  //   cb: () => console.log('FS CONNECTED'),
  // },
  test: {
    paths: ['./mongo/products', './mongo/users', './mongo/orders'],
    cb: async () => {
      await dbConnection();
      console.log('MONGO CONNECTED');
    },
  },
};
const environment = (argsUtil.env as keyof typeof data) ?? 'test';
const { cb, paths } = data[environment];

const importFiles = async (path: string): Promise<any> => await import(path);

const getDao = async (paths: string[], connect: () => void | Promise<void>): Promise<void> => {
  await connect();
  const [{ default: products }, { default: users }, { default: orders }] = await Promise.all(paths.map(importFiles));
  Object.assign(factory, { products, users, orders });
};

getDao(paths, cb);

export default factory;
