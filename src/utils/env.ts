import { config } from 'dotenv';
import args from './args';

const { env = 'test' } = args;
const path = `./.env.${env}`;
config({ path });

export default Object.fromEntries(
  Object.entries({
    PORT: process.env.PORT,
    DB_LINK: process.env.DB_LINK,
    SECRET: process.env.SECRET,
    SECRET_KEY: process.env.SECRET_KEY,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_CLIENT: process.env.GITHUB_CLIENT,
  }).map(([key, value]) => [key, value ?? ''])
);
