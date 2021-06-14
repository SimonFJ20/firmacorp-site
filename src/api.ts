import { Router } from "express"
import { getJasonDB } from "./jasondb";
import { exists, generateUUID } from "./utils";
import { ProduktDoc, UserDoc } from "./models";


export const api = () => {
    const router = Router();
    const db = getJasonDB('db.json');
    
    router.post('/users/login', async (req, res) => {
        try {
            db.load();
            const Users = db.collection('users');

            if(!exists(req.body.username, req.body.password)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const userLogin = {
                username: req.body.username,
                password: req.body.password
            }

            const existingUser = Users.findOne<UserDoc>(userLogin);
            if(!existingUser) {
                res.status(400).json({success: false, response: 'unknown'});
                return;
            }

            existingUser.token = generateUUID(32);
            const user = Users.updateOne<UserDoc>({id: existingUser.id}, existingUser); 
            if(!user) throw new Error('error when updating user');
            db.save();

            res.status(200).json({
                success: true,
                response: 'success',
                user: user.id,
                username: user.username,
                token: user.token
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /users/login', error);
        }
    });

    router.post('/users/logout', async (req, res) => {
        try {
            db.load();
            const Users = db.collection('users');

            if(!exists(req.body.token)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const existingUser = Users.findOne<UserDoc>({token: req.body.token});
            if(!existingUser) {
                res.status(400).json({success: false, response: 'unknown'});
                return;
            }

            existingUser.token = '';
            const user = Users.replaceOne<UserDoc>({id: existingUser.id}, existingUser); 
            if(!user) throw new Error('error when replacing user');
            db.save();

            res.status(200).json({
                success: true,
                response: 'success',
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /users/logout', error);
        }
    });

    router.get('/users/checktoken/:token', async (req, res) => {
        try {
            db.load();
            const Users = db.collection('users');

            if(!exists(req.params.token)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const existingUser = Users.findOne<UserDoc>({token: req.params.token});
            if(!existingUser) {
                res.status(200).json({success: false, response: 'unknown'});
                return;
            }

            res.status(200).json({
                success: true,
                response: 'success',
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /users/checktoken', error);
        }
    });

    router.post('/users/register', async (req, res) => {
        try {
            db.load();
            const Users = db.collection('users');

            if(!exists(req.body.username, req.body.password)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const userLogin = {
                username: req.body.username,
                password: req.body.password
            }

            const existingUser = Users.findOne<UserDoc>({username: userLogin.username});
            if(existingUser) {
                res.status(400).json({success: false, response: 'occupied'});
                return;
            }

            const user = Users.insertOne<UserDoc>(userLogin);
            if(!user) throw new Error('error when inserting user');

            db.save();
            res.status(200).json({
                success: true,
                response: 'success',
                user: user.id,
                username: user.username
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /users/register', error);
        }
    });

    router.post('/products/create', async (req, res) => {
        try {
            db.load();
            const Users = db.collection('users');
            const Products = db.collection('products');

            if(!exists(req.body.token, req.body.title, req.body.description, req.body.price, req.body.images)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const existingUser = Users.findOne<UserDoc>({token: req.body.token});
            if(!existingUser) {
                res.status(400).json({success: false, response: 'unknown'});
                return;
            }

            const productDetails = {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                images: req.body.images
            }

            const product = Products.insertOne<ProduktDoc>(productDetails);
            if(!product) throw new Error('error when inserting product');

            db.save();
            res.status(200).json({
                success: true,
                response: 'success',
                product: product
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /products/create', error);
        }
    });

    router.post('/products/delete', async (req, res) => {
        try {
            db.load();
            const Users = db.collection('users');
            const Products = db.collection('products');

            if(!exists(req.body.token, req.body.id)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const existingUser = Users.findOne<UserDoc>({token: req.body.token});
            if(!existingUser) {
                res.status(400).json({success: false, response: 'unknown'});
                return;
            }

            const product = Products.deleteOne<ProduktDoc>({id: req.body.id});
            if(!product) throw new Error('error when deleting product');

            db.save();
            res.status(200).json({
                success: true,
                response: 'success',
                product: product
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /products/delete', error);
        }
    });

    router.get('/products/getone/:id', async (req, res) => {
        try {
            db.load();
            const Products = db.collection('products');

            if(!exists(req.params.id)) {
                res.status(400).json({success: false, response: 'incomplete'});
                return;
            }

            const product = Products.findOne<ProduktDoc>({id: req.params.id});
            if(!product) {
                res.status(404).json({success: false, response: 'unknown'});
                return;
            }

            res.status(200).json({
                success: true,
                response: 'success',
                product: product
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /products/getone', error);
        }
    });

    router.get('/products/search/:search', async (req, res) => {
        try {
            db.load();
            const Products = db.collection('products');

            const search = req.params.search || '';
            const searchRegex = new RegExp(search);
            const cursor = Products.findAll<ProduktDoc>({});
            const products: ProduktDoc[] = [];
            for(let i in cursor) if(searchRegex.test(cursor[i].title)) products.push(cursor[i]);

            res.status(200).json({
                success: true,
                response: 'success',
                products: products
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /products/search', error);
        }
    });

    router.get('/products/search/', async (req, res) => {
        try {
            db.load();
            const Products = db.collection('products');

            const cursor = Products.findAll<ProduktDoc>({});

            res.status(200).json({
                success: true,
                response: 'success',
                products: cursor
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /products/search', error);
        }
    });

    return router;
}

