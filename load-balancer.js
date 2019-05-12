const express = require('express');
const request = require('request-promise');
const bodyParser = require('body-parser');

const { argmins } = require('./utils');

const PORT = parseInt(process.argv[2]);
const appPorts = [3001, 3002, 3003];
const appLoads = [0, 0, 0];

const app = express();

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('*', async (req,res) => {
    // console.log('***********', req.originalUrl);
    // console.log('*******', req.path);
    // console.log('*************', req.baseUrl);
    try {
        const [ choice ] = argmins(appLoads);
        appLoads[choice]++;
        const url = `http://localhost:${appPorts[choice]}${req.originalUrl}`;
        const promise = request({
            uri: url,
            method: req.method,
            headers: {
                'content-type': req.get('content-type')
            },
            body: JSON.stringify(req.body)
        });
        console.log(req.method, url, appLoads, 'request');
        const resApp = await promise;
        appLoads[choice]--;
        console.log(req.method, url, appLoads, 'reponse');

        res.send(resApp);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ooopsie!');
    }
});

app.listen(PORT, () => {
    console.log(`Load balancer on port ${PORT}...`);
});
