import { Router } from "express"
import { getJasonDB } from "./jasondb";
import { exists, generateUUID } from "./utils";
import { UserDoc } from "./models";


export const api = () => {
    const router = Router();
    const db = getJasonDB('db.json');
    
    router.post('/login', async (req, res) => {
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

            console.log(user)
            res.status(200).json({
                success: true,
                response: 'success',
                user: user.id,
                username: user.username,
                token: user.token
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /login', error);
        }
    });

    router.post('/logout', async (req, res) => {
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

            delete existingUser.token;
            const user = Users.replaceOne<UserDoc>({id: existingUser.id}, existingUser); 
            if(!user) throw new Error('error when replacing user');
            db.save();

            res.status(200).json({
                success: true,
                response: 'success',
            });
        } catch(error) {
            res.status(500).json({success: false, response: 'error'});
            console.error('Error on route /logout', error);
        }
    });

    router.get('/checktoken/:token', async (req, res) => {
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
            console.error('Error on route /logout', error);
        }
    });

    router.post('/register', async (req, res) => {
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
            console.error('Error on route /register', error);
        }
    });



    return router;
}

