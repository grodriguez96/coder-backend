import Roles from '../enums/roles';
import crypto from 'crypto';
import env from '../utils/env';

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
    env.ENV !== 'prod' && (this._id = crypto.randomBytes(12).toString('hex'));
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.lastName = data.lastName;
    this.photo = data.photo || 'img/profile/profile-1.webp';
    this.age = data.age || 18;
    this.role = data.role || Roles.User;
    env.ENV !== 'prod' && (this.updatedAt = new Date());
    env.ENV !== 'prod' && (this.createdAt = new Date());
  }
}

export default UserDTO;
