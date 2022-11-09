import { config } from 'dotenv';
config();

export const { PORT, SECRET_TOKEN, ENABLE_SWAGGER, ORIGIN, CREDENTIALS } = process.env;