// require server, bodyparser, db, schema
var express = require('express');
var bodyParser = require('body-parser')
//var mongoose = require('mongoose');

var jsonGet = { message: "Get test" };
var jsonPost = { message: "Post test" };
var storeModel = [{ name: "Jeans", price: "35"},
                  { name: "Shirt", price: "20"},
                  { name: "Jacket", price: "80"},
                  { name: "Shoes", price: "65"} ];
// instantiate express
const app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;

app.use(express.static('public'))
app.use(express.static('views'))


app.get('/', (req, res) =>
  //res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end(index.html)
)

// get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working
router.get('/', function (req, res) {
    res.json({ message: 'welcome to our api!' });
});

// route /example
router.route('/example')

    // create a bear
    // accessed at POST http://localhost:8080/api/example
    .post(function (req, res) {

    })
    .get(function(req, res) {
      res.json(jsonGet);
    });
router.route('/store')
    .get(function(req, res){
      res.json(storeModel);
    })
// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /api
app.use('/api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);
