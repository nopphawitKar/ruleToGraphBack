var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var Binary = require('mongodb').Binary;
var uri = "mongodb://nopphawit:21546@cluster0-shard-00-00-e1eym.mongodb.net:27017,cluster0-shard-00-01-e1eym.mongodb.net:27017,cluster0-shard-00-02-e1eym.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";


/* GET users listing. */
router.get('/create', function(req, res, next) {
	
	MongoClient.connect(uri, function(err, db) {
		if(err){
		    console.log(err);
		}	
		var dbo = db.db("demo");
		var myobj = { name: "Company Inc", address: "Highway 37" };
		dbo.collection("col1").insertOne(myobj, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
		});
		// db.db("assorule").collection("graphdata").findOne({quizType: "understandability"}, function(err, result){
		// 	res.json(JSON.parse(result.graphData));
		// })
		// db.close();
	});

});

router.get('/uploadfile', function(req, res, next) {
	
	MongoClient.connect(uri, function(err, db) {
		if(err){
		    console.log(err);
		}	
		var dbo = db.db("demo");
		var data = fs.readFileSync("C:\\Users\\katen\\Desktop\\file.txt");
		var insert_data = {};
		insert_data.file_data= Binary(data);

		dbo.collection("col1").insert(insert_data, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
		});
		// db.db("assorule").collection("graphdata").findOne({quizType: "understandability"}, function(err, result){
		// 	res.json(JSON.parse(result.graphData));
		// })
		db.close();
	});

});

router.get('/readdoc', function(req, res, next) {
	
	MongoClient.connect(uri, function(err, db) {
		if(err){
		    console.log(err);
		}	
		var dbo = db.db("demo");

		dbo.collection("col1").findOne({}, function(err, result) {
			if (err) console.error(err);
			fs.writeFile('C:\\Users\\katen\\Desktop\\sss.txt', result.file_data.buffer, function(err){
			  if (err) throw err;
			  console.log('Sucessfully saved!');
			});
		});
		// db.db("assorule").collection("graphdata").findOne({quizType: "understandability"}, function(err, result){
		// 	res.json(JSON.parse(result.graphData));
		// })
		// db.close();
	});

});

/* GET users listing. */
router.get('/learning', function(req, res, next) {
	var theCollection = "smth";
	
	MongoClient.connect(uri, function(err, db) {
		db.db("assorule").collection("graphdata").findOne({quizType: "learnability"}, function(err, result){
			res.json(JSON.parse(result.graphData));
		})
		db.close();
	});

});

module.exports = router;
