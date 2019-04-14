const express = require('express');
const request = require('request-promise');

const { argmins } = require('./utils');

const appPorts = [3001, 3002, 3003];
const appLoads = [0, 0, 0];

const app = express();
app.use(express.static(__dirname + '/static'));

app.get('*', async (req,res) => {
    try {
        const [ choice ] = argmins(appLoads);
        appLoads[choice]++;
        const url = `http://localhost:${appPorts[choice]}${req.originalUrl}`;
        console.log(url, appLoads);
        const resApp = await request(url);
        appLoads[choice]--;

        res.send(resApp);
    } catch (error) {
        // console.log(error);
        res.status(500).send('Ooopsie!');
    }
});

app.listen(3000, () => {
    console.log('Load balancer on port 3000...');
});
