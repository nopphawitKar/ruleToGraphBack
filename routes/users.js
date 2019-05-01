var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjId = require('mongodb').ObjectID;
var uri = "mongodb://nopphawit:21546@cluster0-shard-00-00-e1eym.mongodb.net:27017,cluster0-shard-00-01-e1eym.mongodb.net:27017,cluster0-shard-00-02-e1eym.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
const util = require('util')
var multer  = require('multer')
var upload = multer()
var mongoUtil = require('./util/mongoUtil.js')

const DATABASE_USER = "user";
const COLLECTION_SIGNUP = "signup";
const COLLECTION_SCORE = 'score';

//params
router.param('user_id', function (req, res, next, id) {
  User.find(id, function (err, user) {
    if (err) {
      return next(err)
    } else if (!user) {
      return next(new Error('failed to load user'))
    }
    req.user = user

    // continue processing the request
    next()
  })
})

//check user and password
router.post('/authen', function (req, res) {

	var raw = req.body;
  const param = {username: raw.name}
  mongoUtil.authenUser(DATABASE_USER, COLLECTION_SIGNUP, param, raw.password, res);
})

router.get('/:userId', function(req, res, next) {
	var userId = req.params.userId;
  var objectId = new ObjId(userId);
  const serchToken = {_id: objectId};
  mongoUtil.findUser(DATABASE_USER, COLLECTION_SIGNUP, serchToken, res);
});
//add a new user
router.post('/addNewUser', function (req, res) {

	var userData = req.body;
	var user_personal_data = {
		  username: userData.name,
	    password: userData.password,
	    gender: userData.gender,
	    age: userData.age,
      exp: userData.exp
	};

	const uniqueItem = {username: userData.name};
	mongoUtil.insertUser(DATABASE_USER, COLLECTION_SIGNUP, user_personal_data, uniqueItem, res);
})
router.get('/:userId/getAllScores', function(req, res){
  var userId = req.params.userId;
  const searchToken = {userId: userId};
  const sort = {currentGraph: 1};
  mongoUtil.findAllScore(DATABASE_USER, COLLECTION_SCORE,searchToken, sort, res );
})

router.get('/:userId/getScore', function (req, res) {
  var userId = req.params.userId;
  // var objectUserId = new ObjId(userId);
  const searchToken = {userId: userId};
  const sort = {timeStamp: -1};
  const limit = 1;
  mongoUtil.findMaxOne(DATABASE_USER, COLLECTION_SCORE,searchToken, sort, limit, res );
  // mongoUtil.findOne(DATABASE_USER, COLLECTION_SCORE,searchToken, res );
})
//add a new score
router.post('/addScore', function (req, res) {
/*
  quiz = {
    userId: userId,
    currentQuiz: understand,
    currentGraph: indenttree,
    understand: understand,
    lerrn: learn
  }
  understand = {
    0: {time: 12, allClick: 10,typeCount:10, fCount:10, ctrlCount:10, questionDone:8, heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
    1: {time: 12, allClick: 10, questionDone:8,  heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
    2: {time: 12, allClick: 10, questionDone:8, heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
    3: {time: 12, allClick: 10, questionDone:8,  heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
  }

  learn = {
      0: {time: 12, allClick: 10, questionDone:8,  heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
      1: {time: 12, allClick: 10, questionDone:8,  heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
      2: {time: 12, allClick: 10, questionDone:8,  heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
      3: {time: 12, allClick: 10, questionDone:8,  heatmap: {x:[2,3,5,4,8,6], y:[5,3,5,4,5,6]}},
    }
    */

	var scoreData = req.body;
	// var score_data = {
	// 	  userId: scoreData.userId,
	//     quizType: scoreData.quizType,
  //     graphType: scoreData.graphType,
	//     gender: scoreData.gender,
	//     age: scoreData.age,
  //     exp: scoreData.exp
	// };

	mongoUtil.insertScore(DATABASE_USER, COLLECTION_SCORE, scoreData, res);
})

router.post('/file/upload',  upload.array('arfffiles'), function (req, res) {
  res.json("file recieved" + util.inspect(req.files, false, null, true /* enable colors */));
})
module.exports = router;
