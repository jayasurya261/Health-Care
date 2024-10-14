import dotenv from 'dotenv';
dotenv.config();

export const PORT = 3000;

export const mongoDBURL = process.env.MONGO_URI