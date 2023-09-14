const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const Datastore     = require('nedb');
const responder     = require('./lib/httpResponder');
const db            = {};
const package         = require('./package')
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
    res.send('REST type 1: using nouns ');
});

app.post('/movies', function (req, res) {

    switch (req.body.action) {
        case "viewList":
            db.movies.find({}, res.locals.respond);
            break;

        case "addNew":
            db.movies.insert({ title: req.body.title }, res.locals.respond);

            break;

        //todo case....


        default:
            res.locals.respond({ error: "No action given in request." });
    }

});

app.post('/movies/:id', function (req, res) {

    switch (req.body.action) {
        case "view":
            db.movies.findOne({ _id: req.params.id }, res.locals.respond);
            break;

        case "rate":
            db.movies.update(
                { _id: req.params.id }, 
                { $set: { rating: req.body.rating }}, function (err, num) {
                res.locals.respond(err, { success: num + " records updated" });
            });
            break;
    }

});

