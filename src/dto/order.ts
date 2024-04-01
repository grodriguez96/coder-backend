import { Types } from 'mongoose';
import crypto from 'crypto';
import States from '../enums/states';
import env from '../utils/env';

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
    env.ENV !== 'prod' && (this._id = crypto.randomBytes(12).toString('hex'));
    this.userId = data.userId;
    this.productId = data.productId;
    this.quantity = data.quantity || 1;
    this.state = data.state || States.Reserved;
    env.ENV !== 'prod' && (this.updatedAt = new Date());
    env.ENV !== 'prod' && (this.createdAt = new Date());
  }
}

export default OrderDTO;
