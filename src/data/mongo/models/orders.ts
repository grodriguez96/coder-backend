import { model, PaginateModel, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { Order } from '../../../dto/order';
import States from '../../../enums/states';

type OrderDocument = Document & Order;

const collection = 'orders';

const schema = new Schema(
  {
    productId: { type: Types.ObjectId, required: true, ref: 'products' },
    userId: { type: Types.ObjectId, required: true, ref: 'users' },
    quantity: { type: Number, required: true },
    state: { type: Number, default: States.Reserved, enum: [States.Reserved, States.Paid, States.Finished] },
  },
  { timestamps: true }
);

schema.pre('find', function () {
  this.populate('userId', '-password -createdAt -updatedAt -__v');
});
schema.pre('find', function () {
  this.populate('productId', '-createdAt -updatedAt -__v');
});

schema.plugin(mongoosePaginate);
const Order = model<OrderDocument, PaginateModel<OrderDocument>>(collection, schema);

export default Order;
