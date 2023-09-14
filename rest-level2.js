
const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const Datastore     = require('nedb');
const responder     = require('./lib/httpResponder');
const db            = {};
const package       = require('./package')
const PORT          = package.PORT.default  ;

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Necessary for accessing POST data via req.body object
app.use(bodyParser.json());

// Catch-all route to set global values
app.use(function (req, res, next) {
    res.type('application/json');
    res.locals.respond = responder.setup(res);
    next();
});

app.listen( PORT , () =>  console.log(`Listning on port ${PORT}`) )



// Routes
app.get('/', function (req, res) {
    res.send('Hypermedia type 3: using verbs ');
});

// $url="http://localhost:1234"
// http get "$url/movies"  
app.get('/movies', function (req, res) {
    db.movies.find({}, res.locals.respond);
});

// http post "$url/movies" title="My best movie for today"
app.post('/movies', function (req, res) {
    db.movies.insert({ title: req.body.title }, res.locals.respond);
});

// $id="jx2zadtpu1xUaWUd"
// http get "$url/movies/$id"
app.get('/movies/:id', function (req, res) {
    db.movies.findOne({ _id: req.params.id }, res.locals.respond);
});

// http put "$url/movies/$id" rating=3 level=2 stars=1
app.put('/movies/:id', function (req, res) {
    db.movies.update({ _id: req.params.id}, req.body, function (err, num) {
            res.locals.respond(err, { success: num + " records updated" });
        });
});

// http delete "$url/movies/$id"
app.delete('/movies/:id', function (req, res) {
    db.movies.remove({ _id: req.params.id }, res.locals.respond);
});

