import MongoManager from './manager';
import Products from './models/products';

const products = new MongoManager(Products);
export default products;
