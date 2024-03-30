import { model, PaginateModel, Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Roles from '../../../enums/roles';
import type { User } from '../../../dto/user';

type UserDocument = Document & User;

const collection = 'users';
const schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    photo: {
      type: String,
      default: 'img/profile/profile-1.webp',
    },
    age: { type: Number },
    role: { type: Number, default: Roles.User, enum: [Roles.User, Roles.Admin, Roles.Prem] },
  },
  { timestamps: true }
);
schema.plugin(mongoosePaginate);
const User = model<UserDocument, PaginateModel<UserDocument>>(collection, schema);

export default User;
