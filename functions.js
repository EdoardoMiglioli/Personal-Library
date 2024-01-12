import dotenv from 'dotenv';
import pg from "pg";

dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});
db.connect();

export async function getBooks(sort) {
    const result = await db.query(`SELECT * FROM public.books ORDER BY ${sort}`);
    return result.rows;
}

