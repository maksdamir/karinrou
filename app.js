var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://karinrou:Bqj95YWH8mvEr0KnkMWK6lCBSpq2mD5bGMWtHA0BDWFxc5eC9hAOU15QL5UDI1ITkha0YKs2uuyF49d4amzu3w==@karinrou.documents.azure.com:10255/?ssl=true&replicaSet=globaldb');
mongoose.connect('mongodb://admin:admin@ds153501.mlab.com:53501/heroku_bxshszlm');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.redirect(302,'/');
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
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
