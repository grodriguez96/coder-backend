import FsManager from './manager';
import { PaginateModel } from 'mongoose';
import Model from './model';
import UserDTO from '../../dto/user';

const schema = {
  name: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  age: { type: Number },
  role: { type: Number, required: true },
};

const model = new Model('./src/data/fs/files', 'users', schema) as unknown as PaginateModel<UserDTO>;
const users = new FsManager(model);
export default users;
