const express = require('express');

module.exports = ({ dbA, dbB, meta }) => {
    const router = express.Router();

    router.use(express.static(__dirname + '/static'));
    router.get('/', async (req, res) => {
        res.send('GET /vendors');
    });

    router.get('/login', async (req, res) => {
        res.render('login-vendor.hbs', {}, (err, html) => {
            if (err) {
                return res.send('Rendering error');
            }
            res.send(html);
        });
    });


    router.post('/', async (req, res) => {
        try {
            const vendor = await dbA.collection('Vendors').insertOne({ name: 'XXX' });
            res.send(vendor);

        } catch (error) {
            res.send("Can't insert");
        }
    });

    return router;
};
