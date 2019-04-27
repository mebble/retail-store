const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

module.exports = (db) => {
    const app = express();
    const controllers = require('./controllers')(db);

    app.set('view engine', 'hbs');
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get('/', (req, res) => {
        res.render('home.hbs', {
            pageTitle: 'Home Page',
            banner: 'Retail Store!'
        }, (err, html) => {
            if (err) {
                return res.send('Rendering error');
            }
            res.send(html);
        });
    });

    app.use('/vendor', controllers.vendor);

    app.get('/test', (req, res) => {
        res.send(`RESPONSE: ${Date.now()}`);
    });

    return app;
};
