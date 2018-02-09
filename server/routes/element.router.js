const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

router.get('/', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        console.log('connected to mongo client');
        const db = client.db('solo_project');
        const collection = db.collection('elements');

        collection.aggregate(

            {

            }

        ).toArray(function(error, result) {
            if(error) {
                console.log('error in db', error);
            } else {
                res.send(result);
            }
        });;
    });
});

module.exports = router;