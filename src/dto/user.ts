import Roles from '../enums/roles';
import argsUtil from '../utils/args';
import crypto from 'crypto';

export type User = {
  lastName?: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  age?: number;
  role?: number;
};

class UserDTO {
  public _id?: string;
  public email: string;
  public password: string;
  public name: string;
  public lastName: any;
  public photo: string;
  public age: number;
  public role: number;
  public updatedAt?: Date;
  public createdAt?: Date;

  constructor(data: User) {
    argsUtil.env !== 'prod' && (this._id = crypto.randomBytes(12).toString('hex'));
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.lastName = data.lastName;
    this.photo = data.photo || 'img/profile/profile-1.webp';
    this.age = data.age || 18;
    this.role = data.role || Roles.User;
    argsUtil.env !== 'prod' && (this.updatedAt = new Date());
    argsUtil.env !== 'prod' && (this.createdAt = new Date());
  }
}

export default UserDTO;
