var express      = require('express');
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path         = require('path');
var hbs          = require('hbs');

var app = express();


// DATABASE
// ==============================================

mongoose.connect('mongodb://localhost/database');


// VIEW ENGINE
// ==============================================

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// CONFIGURATION
// ==============================================

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'PoWfMGmk5c8OOcNjySXA', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

if (app.get('env') === 'development') {
 
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
  });
 
}
 
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// AUTHENTICATION
// ==============================================

require('./auth')(passport);

// HELPERS
// ==============================================

require('./helpers');

// ROUTES
// ==============================================


app.use('/admin', require('./routes/user'));
app.use('/', require('./routes/posts'));

// SERVER
// ==============================================

app.listen(3000);