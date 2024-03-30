import { model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { Product } from '../../../dto/product';

type ProductDocument = Document & Product;

const collection = 'products';
const schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    photo: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);
schema.plugin(mongoosePaginate);
const Product = model<ProductDocument, PaginateModel<ProductDocument>>(collection, schema);

export default Product;
