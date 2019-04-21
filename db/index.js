const { MongoClient } = require('mongodb');

const replicaSetA = 'mongodb://localhost:27018,localhost:27019,localhost:27020/?replicaSet=setA';
const replicaSetB = 'mongodb://localhost:27021,localhost:27022,localhost:27023/?replicaSet=setB';

const dbA = MongoClient.connect(replicaSetA, { useNewUrlParser: true })
    .then(client => ({
        client: client,
        db: client.db('retail-store')
    }))
    .catch(error => console.error('Couldn\'t connect to setA'));
const dbB = MongoClient.connect(replicaSetB, { useNewUrlParser: true })
    .then(client => ({
        client: client,
        db: client.db('retail-store')
    }))
    .catch(error => console.error('Couldn\'t connect to setB'));

module.exports = {
    dbA,
    dbB
};
