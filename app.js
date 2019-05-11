const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const items = [{
    itemName: 'sdf',
    itemID: 'sdfgsd',
    itemPrice: '34',
    itemVendor: 'hhhh'
},
{
    itemName: 'wer',
    itemID: 'sdfgsd',
    itemPrice: '23',
    itemVendor: 'mmm'
},
{
    itemName: 'fgh',
    itemID: 'vcvbcvb',
    itemPrice: '45',
    itemVendor: 'gh'
}]
module.exports = (db) => {
    const app = express();
    const controllers = require('./controllers')(db);

    app.set('view engine', 'hbs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
        res.render('product.hbs', {
            pageTitle: 'Home Page',
            productName: 'Food',
            item: items
        }, (err, html) => {
            if (err) {
                return res.send('Rendering error');
            }
            res.send(html);
        });
    });

    app.use('/vendors', controllers.vendors);

    app.get('/test', (req, res) => {
        res.send(`RESPONSE: ${Date.now()}`);
    });

    return app;
};
