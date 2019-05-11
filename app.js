const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

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
            if (err) {
                return res.send('Rendering error');
            }
            res.send(html);
        });
    });

    app.get('/products', async (req, res) => {
        const { category } = req.query;
        let products;
        try {
            products = await dbA.products.find({ category });
        } catch (error) {
            console.log('error hooo');
        }
        console.log(products);
        res.send('yes');
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
