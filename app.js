require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const bodyParser = require("body-parser");
var { v4: uuidv4 } = require("uuid");
var moment = require("moment");

var path = require("path");

const app = express();
const PORT = 5000 || process.env.PORT;

///allow data to be sent by submit form
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

//parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));

//parse application.json
app.use(bodyParser.json());

var sec = uuidv4();
app.use(
  session({
    secret: sec,
    resave: true,
    saveUninitialized: true,
  })
);

//add public media and resourse file
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "/uploads")));
app.use(express.static(path.join(__dirname, "/node_modules")));

//template Engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');
////set cookies
app.use((req, res, next) => {
    var cookie_data = req.cookies.new_forum_user;
  
    if (!req.session.user && cookie_data === undefined) {
      req.session.user = { isLoged: false, user: {} };
    }
  
    console.log("defore cokies");
    console.log(req.session.user);
  
    if (cookie_data) {
      req.session.user = cookie_data;
    }
  
    console.log("after cookies data set");
    console.log(req.session.user);
  
    next();
  });
  
//routs issues
app.use('/', require('./server/routes/main'));
app.use('/blog', require('./server/routes/blog'));
app.use('/jobs', require('./server/routes/job'));
app.use('/course', require('./server/routes/courses'));

///check if page not exist
/*app.use(function (req, res, next) {
    res.status(404);
    // respond with html page
    if (req.accepts("html")) {
      res.render("404", { url: req.url });
      return;
    }
  });*/

  
app.listen(PORT, ()=>{
    console.log(`New Forums is now Running on Port ${PORT}`);
});
//app.listen();