const express = require('express');

module.exports = ({ dbA, dbB, meta }) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send('GET /vendors');
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
