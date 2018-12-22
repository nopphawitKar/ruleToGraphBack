var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inputRouter = require('./routes/input');
var resourceRouter = require('./routes/resource');

var mongoUtil = require('./routes/util/mongoUtil')

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/resource', resourceRouter);
app.use('/users', usersRouter);
app.use('/input', inputRouter);

mongoUtil.connectToServer( function( err ) {
  // start the rest of your app here
  console.log(err + "ok");
} );



app.get('/username/:username', function(req, res, next) {
	const DATABASE_USER = "user";
	const COLLECTION_SIGNUP = "signup";

	var username = req.params.username;
	//Global storage
	app.locals.username = username;
	this.res = res;
	mongoUtil.findOne(DATABASE_USER, COLLECTION_SIGNUP, {username: username}, function(serchResult){
		// console.log(serchResult.password + "password")
		app.locals.password = serchResult.password;
		this.res.json(serchResult);
	});
})

app.post('/login/', function (req, res) {

	var password = req.body.password;
	if(app.locals.password == password){
		console.log("success");
		res.json({login: true})
	}else{
		res.json({login: false})
	}
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;