# retail-store

An online retail store

## Project Setup

### Requirements

- Linux OS
- Node JS version 8 or higher
- npm (Node Package Manager) version 3 or higher
- MongoDB version 4

### MongoDB cluster setup

The MongoDB cluster is made up of mongoDB instances and replica sets. A replica set is a set of instances that are replcas of one another. In this project, there are three replica sets (`setA`, `setB` and `metaSet`), with each set containing three instances.

### Example

Here is an example for setting up the `A1` instance of the server.
Create the `.conf` file using:
```bash
cd /etc
sudo gedit mongod-A1.conf
```

Create the database storage directorie using:
```bash
sudo mkdir /srv/mongodb/A1
```

The following contents are to be in `mongod-A1.conf`:
```yml
processManagement:
   fork: true
   pidFilePath: /srv/mongodb/A1.pid
net:
   bindIp: localhost
   port: 27018
storage:
   dbPath: /srv/mongodb/A1
systemLog:
   destination: file
   path: /var/log/mongodb/A1.log
   logAppend: true
storage:
   journal:
      enabled: true
replication:
  replSetName: setA
```

This project's configuration structure is shown below. You'll have to create all these files/folders manually. The `.conf` file contents should follow the template shown below in "Configuration File". These exact file names are what the source code expects. Also, the mongodb port numbers have currently been hard-coded in `server.js`, which is why the required port to be put in `<port>` in each `.conf` file has also been mentioned below.

```
Config files:
/etc/mongod-A1.conf  (<port> = 27018)
/etc/mongod-A2.conf  (27019)
/etc/mongod-A3.conf  (27020)
/etc/mongod-B1.conf  (27021)
/etc/mongod-B2.conf  (27022)
/etc/mongod-B3.conf  (27023)
/etc/mongod-meta1.conf  (27030)
/etc/mongod-meta2.conf  (27031)
/etc/mongod-meta3.conf  (27032)

Database storage directories:
/srv/mongodb/A1
/srv/mongodb/A2
/srv/mongodb/A3
/srv/mongodb/B1
/srv/mongodb/B2
/srv/mongodb/B3
/srv/mongodb/meta1
/srv/mongodb/meta2
/srv/mongodb/meta3
```

After creating the above files and folders for `A1`, `A2` and `A3`, you need to register their replica
set, `setA`. Open a mongo client:

```bash
mongo localhost:27018
```
Register the replica set `setA`:

```js
config = {
   _id: 'setA',
   members: [
      { _id : 0, host : "localhost:27018" },
      { _id : 1, host : "localhost:27019" },
      { _id : 2, host : "localhost:27020" }
   ]
};
rs.initiate(config);
```

Perform the same steps for registering instances to `setB` and `metaSet`.

The database configuration is now complete. To install server-side libraries, run:

```bash
npm install
```

The client-side libraries are already included.

### Running The Project

Start the replica sets through:

```bash
bash ./scripts/replica-start.sh
```

Start the server through:

```bash
bash ./init-apps.sh
```

To stop the replica sets:

```bash
bash ./scripts/replica-stop.sh
```

## General Instructions

The instructions here are for any general project that uses a mongodb cluster. The section above is a condensed version of what is given here.

### Configuration File

Official instructions [here](https://docs.mongodb.com/manual/administration/configuration/#run-multiple-database-instances-on-the-same-system). Each instance `X` requires the following contents in its configuration file, `/etc/mongod-X.conf`:

```yml
processManagement:
   fork: true
   pidFilePath: /srv/mongodb/X.pid
net:
   bindIp: localhost
   port: <port>
storage:
   dbPath: /srv/mongodb/X
systemLog:
   destination: file
   path: /var/log/mongodb/X.log
   logAppend: true
storage:
   journal:
      enabled: true
```

You'll need superuser priveleges to create and edit the file. Replace every `X` with the instance name. For the `net` section of the config file, `<port>` needs to start from `27018`, as the port of the default instance is `27017`. We also need to manually run `mkdir /srv/mongodb/X/` to create the directory database storage before starting the instance.

### Starting An Instance

The official instructions for the `mongod` process are [here](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/).

- To start instance `X`, run `sudo mongod --config /etc/mongod-X.conf`. Alternatively, you can use the script provided in `./scripts` to run all the instances of the cluster
- If any error occurs, check the contents of the log file at `/var/log/mongodb/dbX.log`
- To connect to an instance through the mongo shell, run `mongo localhost:<port>`, with the port of the appropritate instance

### Making A Replica Set

To include a mongodb instance `X` as a member of a replica set `setA`, add the following contents to `/etc/mongod-X.conf`.

```yml
replication:
  replSetName: setA
```

Do this for all the instances you want to put in `setA`.

### Initiating A Replica Set

Run `sudo mongod --config /etc/mongod-X.conf` for all members of the replica set to start running them.

Connect to any one of the instances of the replica set through the mongo shell using `mongo localhost:<port>`. The instance that you connect to will become the primary replica of that set. Run the following within the mongo shell ([source](https://premaseem.wordpress.com/2016/02/14/mongodb-script-to-run-sharding-with-replica-set-on-local-machine/)) to initiate the set (here `setA`):

```js
config = {
   _id: 'setA',
   members: [
      { _id : 0, host : "localhost:<port1>" },
      { _id : 1, host : "localhost:<port2>" },
      { _id : 2, host : "localhost:<port3>" }
   ]
};
rs.initiate(config);
```

### Connect To A Replica Set through Node.js

First run all the mongodb instances through `sudo mongod --config /etc/mongod-X.conf`. Alternatively, you can use the script provided in `./scripts` to run all the instances. Then connect to them from Node as given at the official tutorial [here](http://mongodb.github.io/node-mongodb-native/3.2/tutorials/connect/). Here's an example of connecting to a replica set `setA`, whose members run on ports `27018`, `27019` and `27020`, all on host `localhost`.

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

To shut down a replica set, run `sudo mongod --config /etc/mongod-X.conf --shutdown` for all members `X` of the replica set, or use the script provided in the `./scripts` directory to shut down all replica sets.

## MongoDB Sharding

[This YouTube video](https://www.youtube.com/watch?v=wYZYrdW9cYU) demonstrates sharding and replication using the built-in MongoDB tools. It shows the setup of multiple mongod instances, but through the mongo shell intead of through configuration file.
