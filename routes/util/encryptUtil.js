const bcrypt = require('bcrypt');
module.exports = {

  getDb: function() {
  	console.log(util.inspect(_db) + "return db");
    return _db;
  },

  isCorrectPassword: function(db, collection, param, res) {
    _db.db(db).collection(collection).findOne(param, function(err, result){
      // res.json(result);
      if(err){
        res.status(CODE_ERROR).send('Not found!')
      }
      res.json(result);
      console.log(result);
    })
  }
};
