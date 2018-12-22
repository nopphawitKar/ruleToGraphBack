var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://nopphawit:21546@cluster0-shard-00-00-e1eym.mongodb.net:27017,cluster0-shard-00-01-e1eym.mongodb.net:27017,cluster0-shard-00-02-e1eym.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
const util = require('util')
var multer  = require('multer')
var upload = multer()
var mongoUtil = require('./util/mongoUtil.js')

const DATABASE_USER = "user";
const COLLECTION_SIGNUP = "signup";

/* GET users listing. */
router.get('/', function(req, res, next) {
	var theCollection = "smth";
	var theDb;
	var db = mongoUtil.getDb();

	db.db("assorule").collection("graphdata").findOne({}, function(err, result){
		res.json(result.graphData);
	})

});

// router.get('/username/:username', function(req, res, next) {
// 	var username = req.params.username;

// 	// db.db("assorule").collection("graphdata").findOne({$or:[{username:username}] }, function(err, result){
// 	// 	res.json(result.graphData);
// 	// })
// 	console.log(username)
// 	mongoUtil.findOne(DATABASE_USER, COLLECTION_SIGNUP, {username: username}, res);

// });

router.post('/create', function (req, res) {

	var userData = req.body;
	var user_personal_data = {
		username: userData.name,
	    password: userData.password,
	    firstname: userData.firstname,
	    lastname: userData.lastname
	};

	const uniqueItem = {username: userData.name};
	mongoUtil.insertUser(DATABASE_USER, COLLECTION_SIGNUP, user_personal_data, uniqueItem, res);
})

router.post('/file/upload',  upload.array('arfffiles'), function (req, res) {
	// console.log(req.body + "xxx")
  res.json("file recieved" + util.inspect(req.files, false, null, true /* enable colors */));
})
module.exports = router;