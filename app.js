var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var cors         = require('cors');
var mustache     = require('mustache-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter  = require('./routes/auth');
var roomRouter  = require('./routes/room');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var VIEWS_PATH = path.join(__dirname, 'views')

app.engine('mst', mustache(VIEWS_PATH + '/partials', '.mst'));
app.set('views', VIEWS_PATH);
app.set('view engine', 'mst');

app.use(express.static(path.join(__dirname, 'public')));

/** set global variable for private rooms */
global.privateRooms = {};

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/room', roomRouter);

module.exports = app;
