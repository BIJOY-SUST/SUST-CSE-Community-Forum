var express = require('express');
var hbs = require('hbs');
var url = require('url');
var path = require('path');
var fs = require('file-system');
var mv = require('mv');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var detect = require('detect-file-type');

var app = express();

var dirProPic = multer({ dest: './media/proPic/' });
var dirPostPic = multer({ dest: './media/postPic/' });

var urlencodedParser = bodyParser.urlencoded({ extended: false }); // Create application/x-www-form-urlencoded parser

var dirPublicPath = path.join(__dirname, './website');

app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
// app.use(bodyParser()); // data exchange between client and server
app.use(express.json());
app.use(bodyParser.json());
app.set('view engine', 'hbs');
app.set('views', dirPublicPath);
app.use(express.static(dirPublicPath));


var port = process.env.PORT || 3001;


app.get('/', function (req, res) {
    // res.send('Hello World!');
    res.render('index');
});

app.get('/login',function (req,res) {
    res.render('login')
});

app.get('/register', function (req, res) {
    res.render('register')
});

app.get('/home', function (req, res) {
    res.render('home')
});

app.get('/people', function (req, res) {
    res.render('peoples')
});

app.get('/group', function (req, res) {
    res.render('groups')
});

app.get('/messenger', function (req, res) {
    res.render('messengers')
});

app.get('/notification', function (req, res) {
    res.render('notifications')
});

app.get('/profile', function (req, res) {
    res.render('myProfile')
})

app.get('/friendProfile', function (req, res) {
    res.render('friendProfile')
})






app.post('/login', urlencodedParser, function (req, res) {
    res.render('home')
});









app.get('/test', function (req, res) {
    // res.render('SUSTCSELIFE');
    // res.render('test')
    // res.render('test2')
    res.render('friendProfile')
    // res.render('home')
    // res.render('peoples')
    // res.render('groups')
    // res.render('notifications')
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});