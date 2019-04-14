const express = require('express');
const request = require('request-promise');

const app = express();
const PORT = parseInt(process.argv[2]);

app.get('*', async (req, res) => {
    try {
        const _ = await request('http://iiita.ac.in');
        res.send(`From app on port ${PORT}`);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Oopsie from app on port ${PORT}`);
    }
});
app.listen(PORT, () => console.log(`app on port ${PORT}...`));
