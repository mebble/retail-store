const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'hbs');
// app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        banner: 'Retail Store!'
    });
});

app.get('/two', (req, res) => {
    const text = req.query['text-field'];
    res.send(`This is GET /two! You send me the value: ${text}`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
