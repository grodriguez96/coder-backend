import { Types } from 'mongoose';
import argsUtil from '../utils/args';
import crypto from 'crypto';
import States from '../enums/states';

export type Order = {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
  state: number;
};

class OrderDTO {
  public _id?: string;
  public userId: Types.ObjectId;
  public productId: Types.ObjectId;
  public quantity: number;
  public state: number;
  public updatedAt?: Date;
  public createdAt?: Date;

  constructor(data: Order) {
    argsUtil.env !== 'prod' && (this._id = crypto.randomBytes(12).toString('hex'));
    this.userId = data.userId;
    this.productId = data.productId;
    this.quantity = data.quantity || 1;
    this.state = data.state || States.Reserved;
    argsUtil.env !== 'prod' && (this.updatedAt = new Date());
    argsUtil.env !== 'prod' && (this.createdAt = new Date());
  }
}

export default OrderDTO;
