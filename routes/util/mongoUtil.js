var MongoClient = require('mongodb').MongoClient;
const util = require('util')
const bcrypt = require('bcrypt');

const CLUSTERS_URL =  'mongodb://nopphawit:21546@cluster0-shard-00-00-e1eym.mongodb.net:27017' +
                      ',cluster0-shard-00-01-e1eym.mongodb.net:27017' +
                      ',cluster0-shard-00-02-e1eym.mongodb.net:27017' +
                      '/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
var _db;
var truePassword = '';
const CODE_ERROR = 500;

const resObj = {duplicatedUser: false, message: ""};
module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(CLUSTERS_URL, function(err, db) {
  		_db = db;
      return callback( util.inspect(err) );
  	});
  },

  getDb: function() {
  	console.log(util.inspect(_db) + "return db");
    return _db;
  },

  insertUser: function(db, collection, data, uniqueItem, res, username) {
   //  _db.db(db).collection(collection).createIndex( {username: "text"}, { unique: true } )
  	// _db.db(db).collection(collection).insertOne(data, function(err, result) {
  	// 	if (err) {
   //      resObj.duplicatedUser = true;
   //      res.json(resObj)
   //    }else{
   //      resObj.message = "new username: " + data.username + " is added";
   //      res.json(resObj);
   //    }
	 // });
       _db.db(db).collection(collection).findOne({$or:[{username:username}]},
        function(err, doc){
          // assert.equal(err, null);
          //
          let response = { sucess: true, msg: "The User Created Successfully"};

          //The User doesn't exist => Add New User
         if(!doc){
           _db.db(db).collection(collection).insertOne(data, function(err, result) {
           	if (err) {
               res.status(CODE_ERROR).send('Username or Password is not match!')
             }else{
               res.json(response);
             }
          });
         }
         else{
            res.status(CODE_ERROR).send('Username or Password is not match!')
         }
       });
  },
  insertScore: function(db, collection, data, res) {
    _db.db(db).collection(collection).insertOne(data, function(err, result) {
    if (err) {
      // resObj.duplicatedUser = true;
      res.json(err)
    }else{
      // resObj.message = "new username: " + data.username + " is added";
      res.json(result);
    }
  });
  },

  findOne: function(db, collection, param, res) {
    _db.db(db).collection(collection).findOne(param, function(err, result){
      res.json(result);
    })
  },

  findMaxOne: function(db, collection, param, sort, limit, res) {
    // _db.db(db).collection(collection).findOne(param, function(err, result){
    //   res.json(result);
    // })
    _db.db(db).collection(collection).find(param).sort(sort).limit(limit)
    .toArray(function(err, result) {
      if (err) throw err;
      console.log(result + 'xxx');
      if(result.length==0){
        res.status(CODE_ERROR).send('no entry!')
      }else{
        res.json(result[0]);
        // console.log(result[0])
      }
      // if(result == ''){
      //   res.status(CODE_ERROR).send('no entry!')
      // }else{
      //   res.json(result[0]);
      //   // res.json(result[0]);
      // }
      // console.log('x'+result+'c'+result.length);
    });
  },

  findAllScore: function(db, collection, param, sort, res) {
    // _db.db(db).collection(collection).findOne(param, function(err, result){
    //   res.json(result);
    // })
    _db.db(db).collection(collection).find(param).sort(sort).toArray(function(err, result) {
      if (err) throw err;
      if(result.length==0){
        res.status(CODE_ERROR).send('no entry!')
      }else{
        res.json(result);
      }

    });
  },

  authenUser: function(db, collection, param, inputPassword, res) {
    _db.db(db).collection(collection).findOne(param, function(err, result){
      if(err){
        res.status(CODE_ERROR).send('Username or Password is not match!')
      }

      if(!result){
        res.status(CODE_ERROR).send('Username or Password is not match!')
      }else if(bcrypt.compareSync(inputPassword, result.password)){
        res.json(result);
      }else{
        res.status(CODE_ERROR).send('Username or Password is not match!')
      }
    })
  },

  findUser: function(db, collection, param, res) {
    _db.db(db).collection(collection).findOne(param, function(err, result){
      // res.json(result);
      if(err){
        res.status(CODE_ERROR).send('Not found!')
      }
      res.json(result);
      // console.log(result);
    })
  }
};
