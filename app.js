
"use strict";
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var settings = require('./settings');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: settings.cookieSecret,
  name: 'testapp',
  cookie: {maxAge: 80000 },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    host:'localhost',
    port:27017,
    db: settings.db,
    url:'mongodb://localhost/microblog'
  })
}));

app.use(function(req, res, next){
  console.log("app.usr local");
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;
  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', indexRouter);
app.use('/reg', indexRouter);
app.use('/login', indexRouter);
app.use('/logout', indexRouter);
app.use('/u/:users', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
app.listen(3000);
