const express = require('express');
const router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

router.get('/', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        console.log('connected to mongo client');
        const db = client.db('soloproject');
        const collection = db.collection('elements');

        collection.aggregate(

            {

            }

        ).toArray(function(error, result) {
            if(error) {
                console.log('error in db', error);
                res.sendStatus(500);
            } else {
                res.send(result);
            }
        });
    client.close();
    });
});

router.get('/:id', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        console.log('connected to mongo client');
        const db = client.db('soloproject');
        const collection = db.collection('elements');

        console.log('id', req.params.id);
        collection.findOne(
            { _id: ObjectId(req.params.id) },
            {},
            function(error, result) {
                if(error) {
                    res.sendStatus(500);
                } else {
                    res.send(result);
                }
            }
        )
        // .toArray(function(error, result) {
        //     if(error) {
        //         console.log('error in db', error);
        //     } else {
        //         res.send(result);
        //     }
        // });
    client.close();
    });
});

router.post('/:id', (req, res) => {
    console.log(req.body);


    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        console.log('connected to mongo client');
        const db = client.db('soloproject');
        const collection = db.collection('elements');

        console.log('id', req.params.id);
        console.log('req.body', req.body);
        req.body._id = ObjectId(req.body._id);
        collection.save(
            req.body, {w:1}, function(error, result) {
                if(error) {
                    console.log('error in db', error);
                    res.sendStatus(500);
                } else {
                    res.send(result);
                    console.log('result', result.result);
                }
        });
    client.close();
    });
});

module.exports = router;