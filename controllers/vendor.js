const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send('GET /vendor');
    });

    return router;
};
