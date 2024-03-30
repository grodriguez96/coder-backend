import MongoManager from './manager';
import User from './models/users';

const users = new MongoManager(User);
export default users;
