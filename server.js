const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const app = express();

const Chat = require('./models/Chat');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
//Passport config
require('./config/passport')(passport);

//Db Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Mongo Db Connected'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body-parser
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  express.urlencoded({
    extended: false
  })
);

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Socket setup
var io = socket(server);
// MongoClient.connect(db, function(err, db) {
//   var messagescollection = db.collection('chats');
//   console.log(messagescollection);
// });

io.on('connection', function(socket) {
  console.log('made socket connection.', socket.id);

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('chat', data => {
    io.emit('chat', data);
    var chat = new Chat();
    chat.message = data.message;
    chat.username = data.username;
    console.log(chat);
    chat.save();
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', data);
  });
});

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
