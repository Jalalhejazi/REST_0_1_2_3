const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const Datastore     = require('nedb');
const responder     = require('./lib/httpResponder');
const db            = {};
const package       = require('./package')
const PORT          = package.PORT.default  ;

// TODO 
const root          = `http://localhost:${PORT}`  

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });
// Add an index
db.movies.ensureIndex({ fieldName: 'title', unique: true });

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
    res.send('using verbs with status ');
});

app.get('/movies', function (req, res) {
    db.movies.find({}, res.locals.respond);
});

app.post('/movies', function (req, res) {

    if (!req.body.title) {
        res.json(400, { error: { message: "A title is required to create a new movie." }});
        return;
    }

    db.movies.insert({ title: req.body.title }, function (err, created) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        res.set('Location', root + '/movies/' + created._id);
        res.json(201, created);
    });
});

app.get('/movies/:id', function (req, res) {
    db.movies.findOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (!result) {
            res.json(404, { error: { message: "We did not find a movie with id: " + req.params.id }});
            return;
        }

        res.json(200, result);
    });
});

app.put('/movies/:id', function (req, res) {
    db.movies.update({ _id: req.params.id }, req.body, { upsert: false }, function (err, num, upsert) {
        
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (num === 0) {
            res.json(400, { error: { message: "No records were updated." }});
            return;
        }

        res.json(200, { success: { message: "Sucessfully updated movie with ID " + req.params.id }});
    });
});

app.delete('/movies/:id', function (req, res) {
    db.movies.remove({ _id: req.params.id }, function (err, num) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (num === 0) {
            res.json(404, { error: { message: "We did not find a movie with id: " + req.params.id }});
            return;
        }

        res.set('Link', root + '/movies; rel="collection"');
        res.send(204);
    });
});
