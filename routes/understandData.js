var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://nopphawit:21546@cluster0-shard-00-00-yhw5u.mongodb.net:27017,cluster0-shard-00-01-yhw5u.mongodb.net:27017,cluster0-shard-00-02-yhw5u.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";


/* GET users listing. */
router.get('/', function(req, res, next) {
	var theCollection = "smth";
	
	MongoClient.connect(uri, function(err, db) {
		db.db("assorule").collection("graphdata").findOne({}, function(err, result){
			res.json(JSON.parse(result.graphData));
		})
		db.close();
	});

});

module.exports = router;
