const { MongoClient } = require('mongodb');

const PORT = parseInt(process.argv[2]);

async function connectDB() {
    const replicaSetA = 'mongodb://localhost:27018,localhost:27019,localhost:27020/?replicaSet=setA';
    const replicaSetB = 'mongodb://localhost:27021,localhost:27022,localhost:27023/?replicaSet=setB';
    const metaSet = 'mongodb://localhost:27030,localhost:27031,localhost:27032/?replicaSet=metaSet';

    const promiseA = MongoClient.connect(replicaSetA, { useNewUrlParser: true })
        .catch(err => {
            console.log("Couldn't connect to setA");
            return Promise.reject();
        });
    const promiseB = MongoClient.connect(replicaSetB, { useNewUrlParser: true })
        .catch(err => {
            console.log("Couldn't connect to setB");
            return Promise.reject();
        });
    const promiseMeta = MongoClient.connect(metaSet, { useNewUrlParser: true })
        .catch(err => {
            console.log("Couldn't connect to metaSet");
            return Promise.reject();
        });

    const [ clientA, clientB, clientMeta ] = await Promise.all([promiseA, promiseB, promiseMeta]);
    const dbA = clientA.db('retail-store');
    const dbB = clientB.db('retail-store');
    const meta = clientMeta.db('retail-store-meta');

    return {
        dbA, dbB, meta
    };
}

connectDB()
    .then(db => {
        console.log(`app ${PORT} connected to the DB`);
        const app = require('./app.js')(db);
        app.listen(PORT, () => console.log(`app ${PORT} now listening for requests...`));
    })
    .catch(error => {
        console.error('Unable to connect to DB');
    });
