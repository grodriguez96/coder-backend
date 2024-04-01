import { config } from 'dotenv';

const env = process.env.env || 'prod';
const path = `./.env.${env}`;
config({ path });

export default Object.fromEntries(
  Object.entries({
    ENV: env,
    PORT: process.env.PORT,
    PERSISTENT: process.env.PERSISTENT,
    DB_LINK: process.env.DB_LINK,
    SECRET: process.env.SECRET,
    SECRET_KEY: process.env.SECRET_KEY,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
  }).map(([key, value]) => [key, value ?? ''])
);
