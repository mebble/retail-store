const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

// const db = require('./db');

const app = express();
const PORT = parseInt(process.argv[2]);

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

app.get('/test', (req, res) => {
    res.send(`RESPONSE: ${Date.now()}`);
});

app.listen(PORT, () => console.log(`app on port ${PORT}...`));
