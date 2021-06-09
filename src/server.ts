import cors from "cors";
import express from "express";
import path from "path";
import { api } from "./api";
import { getJasonDB } from "./jasondb";

const PORT = 80;

const app = express();

app.use(cors(), express.json(), express.urlencoded({extended: true}));

app.get('/', async (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

app.get('/products', async (req, res) => res.sendFile(path.join(__dirname, '../public/products/index.html')));

app.get('/product/:id', async (req, res) => {
    const Products = getJasonDB('db.json').collection('products');
    if(Products.findOne({id: req.params.id})) res.status(404).sendFile(path.join(__dirname, '../public/product/index.html'))
    res.status(404);
});

const apiRouter = api();
app.use('/api', api);
app.use('/', express.static(path.join(__dirname, '../public/')));

app.listen(PORT, () => {
    console.log('Express on port', PORT);
});

