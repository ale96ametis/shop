// require server, bodyparser, db, schema
var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Item = require('./item.js');

var jsonGet = { message: "Get test" };
var jsonPost = { message: "Post test" };
var storeModel = [{ name: "Jeans", price: "35"},
                  { name: "Shirt", price: "20"},
                  { name: "Jacket", price: "80"},
                  { name: "Shoes", price: "65"} ];
// instantiate express
const app = express();

//connect to MongoDB
var uri = "mongodb://admin:password@ds143907.mlab.com:43907/db_shop";
var options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
//mongoose.connect(uri, options);
mongoose.connect(uri, options).then(
  () => { console.log("Db connected!")/** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
  err => { console.log("Db error connection " + err )/** handle initial connection error */ }
);
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
    // example api
    // accessed at POST http://localhost:8080/api/example
    .post(function (req, res) {
      res.json(jsonPost);
    })
    .get(function(req, res) {
      res.json(jsonGet);
    });
router.route('/store')
    // get all elements on the db
    .get(function(req, res){
      Item.find((err, items) => {
        if (err) { res.send(err) }
        res.json(items);
      })
      //res.json(storeModel);
    })
    // save new element on the db
    .post(function(req, res){
      var item = new Item();
      if (req.body.name) { item.name = req.body.name; }
      if (req.body.price) { item.price = req.body.price; }
      console.log(item);
      item.save( (err) =>{
        if (err) { res.send(err); }
      });
      res.json(item);
    })
    .delete(function(req, res) {
      if (req.body.id) {
        Item.remove({
             _id: req.body.id
         }, function (err, item) {
             if (err) { res.send(err); }
             res.json({ message: 'Successfully deleted' });
         });
      };
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
