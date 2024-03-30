import argsUtil from '../utils/args';
import crypto from 'crypto';

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
    argsUtil.env !== 'prod' && (this._id = crypto.randomBytes(12).toString('hex'));
    this.title = data.title;
    this.photo = data.photo;
    this.stock = data.stock || 1;
    this.price = data.price || 0;
    argsUtil.env !== 'prod' && (this.updatedAt = new Date());
    argsUtil.env !== 'prod' && (this.createdAt = new Date());
  }
}

export default ProductDTO;
