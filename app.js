const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');

const { argmins } = require('./utils');

const JWT_SECRET = 'kfj20efu8FJ2ef9fjj2FJE29f0BFon2okf';

module.exports = ({ dbA, dbB, meta }) => {
    const app = express();

    app.set('view engine', 'hbs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
        res.render('index.hbs', {
            pageTitle: 'Home Page'
        }, (err, html) => {
            if (err) return res.send('Rendering error');
            res.send(html);
        });
    });

    app.get('/checkout', async (req, res) => {
        const id = req.query.id;
        const quantity = parseInt(req.query.quantity);
        if (isNaN(quantity)) return res.send('Invalid quantity');
        try {
            const doc = await meta.collection('lookup').findOne({ object_id: id });
            const db = {
                'setA': dbA,
                'setB': dbB
            }[doc.shard];
            const product = await db.collection('products').findOne({ _id: new ObjectID(doc.object_id) });
            const total = product.price * quantity;
            res.render('checkout.hbs', {
                pageTitle: 'Checkout',
                name: product.name,
                _id: product._id,
                vendorID: product.vendorID,
                totalPrice: total
            }, (err, html) => {
                if (err) return res.send('Rendering error');
                res.send(html);
            });
        } catch (error) {
            res.send('Some error occurred');
        }
    });

    app.get('/products', async (req, res) => {
        const { category } = req.query;
        try {
            const p1 = dbA.collection('products').find({ category }).toArray();
            const p2 = dbB.collection('products').find({ category }).toArray();
            const [ resA, resB ] = await Promise.all([p1, p2]);
            const products = [...resA, ...resB];
            // vendorIds = await Promise.all(products.map(async p => {
            //     await dbA.collection('vendors').find({ _id: new ObjectId(p.vendorID) });
            //     await dbB.collection('vendors').find({ _id: new ObjectId(p.vendorID) });
            // }));
            console.log(products);
            res.render('product.hbs', {
                pageTitle: 'Products',
                productName: category,
                items: products
            }, (err, html) => {
                if (err) {
                    return res.send('Rendering error');
                }
                res.send(html);
            });
        } catch (error) {
            console.log('foofoofoo');
            res.send('Some error occurred');
        }
    });

    app.get('/vendors', async (req, res) => {
        res.send('GET /vendors');
    });

    app.get('/login', async (req, res) => {
        res.render('login-vendor.hbs', {}, (err, html) => {
            if (err) {
                return res.send('Rendering error');
            }
            res.send(html);
        });
    });

    app.post('/product', async (req, res) => {
        try {
            const shards = await meta.collection('shards').find().toArray();
            const sizes = shards.map(r => r.size);
            const [ i ] = argmins(sizes);
            const shard = shards[i].name;
            const db = {
                'setA': dbA,
                'setB': dbB
            }[shard];
            if (typeof db === 'undefined') {
                return res.send('Couldn\'t find shard');
            }

            const { product } = req.body;
            const inserted = (await db.collection('products').insertOne(product)).ops[0];
            await meta.collection('shards')
                .findOneAndUpdate(
                    { name: shard },
                    { $inc: { size: 1 } },
                    { returnOriginal: false }
                );
            await meta.collection('lookup').insertOne({
                object_id: inserted._id.toString(),
                shard: shard
            });
            res.send({ product: inserted });
        } catch (error) {
            res.send('errorsss')
        }
    });

    // app.post('/access', async (req, res) => {
    //     // form object has been stringified and is a key within req.body
    //     const form = JSON.parse(Object.keys(req.body)[0]);
    //     console.log(form);
    //     try {
    //         if (type === 'login') {
    //             let db;
    //             let v1;
    //             try {
    //                 v1 = await dbA.collection('vendors').findOne({ name: form.name });
    //                 db = dbA;
    //             } catch (error) {
    //                 v1 = undefined;
    //             }
    //             let v2;
    //             try {
    //                 v2 = await dbB.collection('vendors').findOne({ name: form.name });
    //                 db = dbB;
    //             } catch (error) {
    //                 v2 = undefined;
    //             }
    //             const vendor = v1
    //                 ? v1
    //                 : v2
    //                     ? v2 : undefined;
    //             if (typeof vendor === 'undefined') return res.send("Vendor doesn't exist");

    //             const access = 'auth';
    //             const token = jwt.sign({
    //                 _id: vendor._id.toString(),
    //                 access
    //             }, JWT_SECRET).toString();
    //             const vendor = await db.collection('vendors')
    //                 .findOneAndUpdate(
    //                     { _id: vendor._id },
    //                     { $push: { tokens: { access, token } } },
    //                     { returnOriginal: false }
    //                 );
    //             res.set('x-auth', token);
    //             res.render('', {}, (err, html) => {

    //             });
    //         } else if (type === 'signup') {
    //             const shards = await meta.collection('shards').find().toArray();
    //             const sizes = shards.map(r => r.size);
    //             const [i] = argmins(sizes);
    //             const shard = shards[i].name;
    //             const db = {
    //                 'setA': dbA,
    //                 'setB': dbB
    //             }[shard];
    //             if (typeof db === 'undefined') {
    //                 return res.send('Couldn\'t find shard');
    //             }

    //             const { name, password } = req.body;
    //             const hash = await bcrypt.hash(password, 10);
    //             const inserted = (await db.collection('vendors').insertOne({
    //                 name,
    //                 password: hash,
    //                 tokens: []
    //             })).ops[0];

    //             await meta.collection('shards')
    //                 .findOneAndUpdate(
    //                     { name: shard },
    //                     { $inc: { size: 1 } },
    //                     { returnOriginal: false }
    //                 );
    //             await meta.collection('lookup').insertOne({
    //                 object_id: inserted._id.toString(),
    //                 shard: shard
    //             });

    //             const access = 'auth';
    //             const token = jwt.sign({
    //                 _id: inserted._id.toString(),
    //                 access
    //             }, JWT_SECRET).toString();
    //             const vendor = await db.collection('vendors')
    //                 .findOneAndUpdate(
    //                     { _id: inserted._id },
    //                     { $push: { tokens: { access, token } } },
    //                     { returnOriginal: false }
    //                 );
    //             res.set('x-auth', token);
    //             return res.render('add-prod-vendor.hbs', {
    //                 pageTitle: 'Dashboard'
    //             }, (err, html) => {
    //                 if (err) return res.send('Rendering error');
    //                 res.send(html);
    //             });
    //         } else {
    //             return res.send('Invalid access type');
    //         }
    //     } catch (error) {
    //         return res.send('Some error occurred');
    //     }
    // });

    app.get('/test', (req, res) => {
        res.send(`RESPONSE: ${Date.now()}`);
    });

    return app;
};
