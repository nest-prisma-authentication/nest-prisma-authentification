# Read me
## installation
### Start mongodb replicaset
- Start mongodb as replicaset :  
Edit /etc/mongod.conf, find the line that reads #replication: towards the bottom of the file. It will look like this:
```conf
. . .
#replication:
. . . 
```
Uncomment this line by removing the pound sign (#). Then add a replSetName directive below this line followed by a name which MongoDB will use to identify the replica set:
```conf
. . .
replication:
  replSetName: "rs0"
. . .  
```
Restart the mongod server
```sh
$ sudo systemctl restart mongod
```
- connect to mongodb and initiate the replicaset
```sh
$ mongo
```
```mongo
mongo> rs.initiate()
```
Refferences :  
https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/
https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/
https://www.digitalocean.com/community/tutorials/how-to-configure-a-mongodb-replica-set-on-ubuntu-20-04

## Create the database
```sh
$ npx prisma db push
```

# Start the app
```sh
$ npm run start:dev
```