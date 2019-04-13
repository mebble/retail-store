# retail-store

An online retail store

## Running Multiple MongoDB Instances

### Configuration File

Official instructions [here](https://docs.mongodb.com/manual/administration/configuration/#run-multiple-database-instances-on-the-same-system). Each instance `X` requires the following contents in its configuration file, `/etc/mongod-X.conf`:

```yml
processManagement:
   fork: true
   pidFilePath: /srv/mongodb/dbX.pid
net:
   bindIp: localhost
   port: <port>
storage:
   dbPath: /srv/mongodb/dbX
systemLog:
   destination: file
   path: /var/log/mongodb/dbX.log
   logAppend: true
storage:
   journal:
      enabled: true
processManagement:
```

You'll need superuser priveleges to create and edit the file. Replace every `X` with the instance name. For the `net` section of the config file, `port` needs to start from `27018`, as the port of the default instance is `27017`. We also need to manually run `mkdir /srv/mongodb/dbX/` to create the directory database storage before starting the instance.

### Starting An Instance

The official instructions for the `mongod` process are [here](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/).

- To start instance `X`, run `sudo mongod --config /etc/mongod-X.conf`
- If any error occurs, check the contents of the log file at `/var/log/mongodb/dbX.log`
- To connect to an instance through the mongo shell, run `mongo localhost:<port>`, with the port of the appropritate instance

### Making A Replica Set

To include a mongodb instance `X` as a member of a replica set `setA`, add the following contents to `/etc/mongod-X.conf`.

```yml
replication:
  replSetName: setA
```

Do this for all the instances you want to put in `setA`.

### Running A Replica Set

Run `sudo mongod --config /etc/mongod-X.conf` for all members of the replica set to start running them.

Connect to any one of the instances of the replica set through the mongo shell using `mongo localhost:<port>`. The instance that you connect to will become the primary replica of that set. Run the following within the mongo shell ([source](https://premaseem.wordpress.com/2016/02/14/mongodb-script-to-run-sharding-with-replica-set-on-local-machine/)):

```js
config = {
   _id: 's0',
   members: [
      { _id : 0, host : "localhost:37017" },
      { _id : 1, host : "localhost:37018" },
      { _id : 2, host : "localhost:37019" }
   ]
};
rs.initiate(config);
```

### Connect To A Replica Set through Node.js

Official tutorial [here](http://mongodb.github.io/node-mongodb-native/3.2/tutorials/connect/). Here's an example of connecting to a replica set `setA`, whose members run on ports `27018`, `27019` and `27020`, all on host `localhost`.

```js
const { MongoClient } = require('mongodb');

const replicaSetMembers = 'mongodb://localhost:27018,localhost:27019,localhost:27020/?replicaSet=setA';

MongoClient.connect(replicaSetMembers)
    .then(async client => {
        const db = client.db('Foo');
        // do stuff
        client.close();
    })
    .catch(err => console.error(err));
```

To shut down a replica set, run `sudo mongod --config /etc/mongod-X.conf --shutdown` for all members `X` of the replica set.

## MongoDB Sharding

[This YouTube video](https://www.youtube.com/watch?v=wYZYrdW9cYU) demonstrates sharding and replication using the built-in MongoDB tools. It shows the setup of multiple mongod instances, but through the mongo shell intead of through configuration file.

## Manual Implementation

All we will implement is the splitting:

- how to split the database
   - split db based on collection
   - split every collection (actual sharding?)
      - range
      - hash
- split routing table

Using MongoDB replica sets, the following will be done for us:

- primary and secondary replicas per shard
- replica sync for writes
- replica load balancing for reads
- primary replica re-election when a primary replica crashes

We can define and connect to a replica set through Node.js using [this example](http://mongodb.github.io/node-mongodb-native/3.2/tutorials/connect/#connect-to-a-replica-set).

If we implement our own splitting algorithm instead of using mongos, we won't get:

- shard chunk balancing when a shard gets too big relative to other shards
