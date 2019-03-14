var MongoClient = require('mongodb').MongoClient;
const util = require('util')
var uri = "mongodb://nopphawit:21546@cluster0-shard-00-00-e1eym.mongodb.net:27017,cluster0-shard-00-01-e1eym.mongodb.net:27017,cluster0-shard-00-02-e1eym.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
var _db;

var resObj = {duplicatedUser: false, message: ""};
module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(uri, function(err, db) {
		_db = db;
      return callback( util.inspect(err) );
	});
  },

  getDb: function() {
  	console.log(util.inspect(_db) + "return db");
    return _db;
  },

  insertUser: function(db, collection, data, uniqueItem, res) {
    _db.db(db).collection(collection).createIndex( {username: "text"}, { unique: true } )
  	_db.db(db).collection(collection).insertOne(data, function(err, result) {
		if (err) {
      resObj.duplicatedUser = true;
      res.json(resObj)
    }else{
      resObj.message = "new username: " + data.username + " is added";
      res.json(resObj);
    }
	});
  },

  // findOne: function(db, collection, param, res) {
  // 	_db.db(db).collection(collection).findOne(param, function(err, result){
  //     res.json(result);
  //   })
  // }
  findOne: function(db, collection, param, callback) {
    _db.db(db).collection(collection).findOne(param, function(err, result){
      // res.json(result);
      callback(result);
    })
  }
};