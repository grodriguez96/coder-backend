import { connect, Mongoose } from 'mongoose';
import env from './env';

export default function (): Promise<Mongoose> {
  try {
    return connect(env.DB_LINK);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
