import * as api from "./api.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import * as functions from "./functions.js";
import pg from "pg";


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
db.connect()


app.get("/", (req, res) => {
    res.render("index")
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});