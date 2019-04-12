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

Replace every `X` with the instance name. For the `net` section of the config file, `port` needs to start from `27018`, as the port of the default instance is `27017`. We also need to manually run `mkdir /srv/mongodb/dbX/` to create the directory database storage before starting the instance.

### Starting An Instance

The official instructions for the `mongod` process are [here](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/).

- To start instance `X`, run `sudo mongod --config /etc/mongod-X.conf`
- If any error occurs, check the contents of the log file at `/var/log/mongodb/dbX.log`
- To connect to an instance through the mongo shell, run `mongo localhost:<port>`, with the port of the appropritate instance

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
