import { config } from 'dotenv';
config();

export const { PORT, SECRET_TOKEN } = process.env;