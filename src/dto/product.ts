import crypto from 'crypto';
import env from '../utils/env';

export type Product = {
  title: string;
  photo: string;
  stock: number;
  price: number;
};

class ProductDTO {
  public _id?: string;
  public title: string;
  public photo: string;
  public stock: number;
  public price: number;
  public updatedAt?: Date;
  public createdAt?: Date;

  constructor(data: Product) {
    env.ENV !== 'prod' && (this._id = crypto.randomBytes(12).toString('hex'));
    this.title = data.title;
    this.photo = data.photo;
    this.stock = data.stock || 1;
    this.price = data.price || 0;
    env.ENV !== 'prod' && (this.updatedAt = new Date());
    env.ENV !== 'prod' && (this.createdAt = new Date());
  }
}

export default ProductDTO;
