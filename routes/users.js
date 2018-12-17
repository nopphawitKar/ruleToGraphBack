var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://nopphawit:21546@cluster0-shard-00-00-yhw5u.mongodb.net:27017,cluster0-shard-00-01-yhw5u.mongodb.net:27017,cluster0-shard-00-02-yhw5u.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
const util = require('util')
var multer  = require('multer')
var upload = multer()

const DATABASE_USER = "user";
const COLLECTION_PERSONAL_DATA = "personalData";

// router.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
/* GET users listing. */
router.get('/', function(req, res, next) {
	var theCollection = "smth";
	
	MongoClient.connect(uri, function(err, db) {
		db.db("assorule").collection("graphdata").findOne({}, function(err, result){
			res.json(result.graphData);

		})
		db.close();
	});

});

router.post('/create', function (req, res) {

	MongoClient.connect(uri, function(err, db) {
		if(err){
		    console.log(err);
		}	
		var dbo = db.db(DATABASE_USER);

		dbo.collection(COLLECTION_PERSONAL_DATA).insert(res.body, function(err, res) {
			if (err) throw err;
  			res.json("file recieved" + util.inspect(req.body, false, null, true /* enable colors */));
			console.log("1 document inserted");
		});
		// db.db("assorule").collection("graphdata").findOne({quizType: "understandability"}, function(err, result){
		// 	res.json(JSON.parse(result.graphData));
		// })
		// db.close();
	});
})

router.post('/file/upload',  upload.array('arfffiles'), function (req, res) {
	// console.log(req.body + "xxx")
  res.json("file recieved" + util.inspect(req.files, false, null, true /* enable colors */));
})
module.exports = router;