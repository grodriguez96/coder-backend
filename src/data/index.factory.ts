import type { Order } from '../dto/order';
import type { Product } from '../dto/product';
import type { User } from '../dto/user';
import type { Manager } from '../interfaces/manager';
import argsUtil from '../utils/args';
import env from '../utils/env';
import persistences from './persistences';

type Factory = {
  products: Manager<Product>;
  users: Manager<User>;
  orders: Manager<Order>;
};

const factory: Factory = Object.create({});

const data = {
  test: persistences.memory,
  dev: persistences.fs,
  prod: persistences.mongo,
};
const environment = (argsUtil.env as keyof typeof data) ?? 'test';
const persistence = env.PERSISTENT as keyof typeof persistences;
const { cb, paths } = persistences[persistence] ?? data[environment];

const importFiles = async (path: string): Promise<any> => await import(path);

const getDao = async (paths: string[], connect: () => void | Promise<void>): Promise<void> => {
  await connect();
  const [{ default: products }, { default: users }, { default: orders }] = await Promise.all(paths.map(importFiles));
  Object.assign(factory, { products, users, orders });
};

getDao(paths, cb);

export default factory;
