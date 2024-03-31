import dbConnection from '../utils/dbConnection';

const memory = {
  paths: ['./memory/products', './memory/users', './memory/orders'],
  cb: () => console.log('MEMORY CONNECTED'),
};

const mongo = {
  paths: ['./mongo/products', './mongo/users', './mongo/orders'],
  cb: async () => {
    await dbConnection();
    console.log('MONGO CONNECTED');
  },
};

const fs = {
  paths: ['./fs/products', './fs/users', './fs/orders'],
  cb: () => console.log('FS CONNECTED'),
};

export default { fs, memory, mongo };
