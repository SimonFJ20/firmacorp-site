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

    //BANDAID FIX
    //TODO: STATIC DIRECTORY?
    //if (req.params.id === 'style.css') return res.sendFile(path.join(__dirname, '../public/product/style.css'));
    //if (req.params.id === 'script.js') return res.sendFile(path.join(__dirname, '../public/product/script.js'));

    const Products = getJasonDB('db.json').collection('products');
    if(Products.findOne({id: req.params.id})) return res.status(200).sendFile(path.join(__dirname, '../public/product/index.html'))

    res.status(404).send('<center><h1>Product not found</h1><a href="/"><button>Gå tilbage</button></a></center>');
});

app.get('/product', async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/product/index.html'))
});

const apiRouter = api();
app.use('/api', apiRouter);
app.use('/', express.static(path.join(__dirname, '../public/')));
app.use('/static', express.static(path.join(__dirname, '../public/')));

app.listen(PORT, () => {
    console.log('Express on port', PORT);
});

