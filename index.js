import * as api from "./api.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import * as fn from "./functions.js";
import pg from "pg";

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views');

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});
db.connect();

let defaultSort = "id ASC";
app.get("/", async (req, res) => {
    if (req.query.sort) {
        defaultSort = req.query.sort;
    }
    var books = await fn.getBooks(req.query.sort || defaultSort);
    res.render("index", {books: books});
});

app.get("/post", (req, res) => {
    res.render("post_book");
});

app.get("/book/:id", (req, res) => {
    res.render("book");
});


app.post("/post", async (req, res) => {
    let newBookTitle = req.body.title;
    let newBookRating = parseInt(req.body.rating, 10);
    let newBookISBN = req.body.isbn;
    let newBookPersonalNotes = req.body.personalNotes;

    let postResult = fn.postBook(newBookTitle, newBookRating, newBookISBN, newBookPersonalNotes);

    if (postResult === 1) {
        console.log("Error posting a new book");
    }

    res.redirect("/");
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});