const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { argmins } = require('./utils');


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
        res.render('add-prod-vendor.hbs', {}, (err, html) => {
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
                res.send('Couldn\'t find shard');
            }

            const { product } = req.body;
            const inserted = (await db.collection('products').insertOne(product)).ops[0];
            meta.collection('shards')
                .findOneAndUpdate({ name: shard }, {
                    $inc: { size: 1 }
                }, { returnOriginal: false });
            meta.collection('lookup').insertOne({
                object_id: inserted._id.toString(),
                shard: shard
            });
            res.send({ product: inserted });
        } catch (error) {
            console.log('*************************************************');
            console.log(error);
            res.send('errorsss')
        }
    });

    app.get('/test', (req, res) => {
        res.send(`RESPONSE: ${Date.now()}`);
    });

    return app;
};
