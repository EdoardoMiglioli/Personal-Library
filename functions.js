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

// API
export async function getCoverURL(isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`
}

export async function getBookById(id) {
    const result = await db.query("SELECT * FROM public.books WHERE id = $1",
    [id]);
    return result.rows[0];
}


// DB
export async function getBooks(sort) {
    const result = await db.query(`SELECT * FROM public.books ORDER BY ${sort}`);
    return result.rows;
}

export async function postBook(title, rating, isbn, personalNotes) {
    
    try{

        let coverURL = await getCoverURL(isbn);
        console.log(typeof coverURL);
        console.log(coverURL);
        const result = await db.query(`INSERT INTO public.books(title, coverurl, isbn, rating, personal_notes) VALUES($1, $2, $3, $4, $5)
        `, [title, coverURL, isbn, rating, personalNotes]);
        
        return 0
    } catch (err) {
        console.error(err);
        return 1;
    }
}

export async function editBook(book) {
    try{
        let coverURL = await getCoverURL(book.isbn);
        const result = await db.query(`UPDATE public.books SET title = $1, coverurl = $2, isbn = $3, rating = $4, personal_notes = $5 WHERE id = $6`,
        [book.title, coverURL, book.isbn, book.rating, book.personal_notes, book.id]);

        return 0
    } catch(err) {
        console.error(err);
        return 1;
    }

}
