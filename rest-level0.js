const express       = require('express');
const app           = express();

const bodyParser    = require('body-parser');
const Datastore     = require('nedb');

const db            = {};
const package         = require('./package')
const PORT          = package.PORT.default  ;

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Necessary for accessing POST data via req.body object
app.use(bodyParser.json());

app.listen( PORT , () =>  console.log(`Listning on port ${PORT}`) )


// Routes
app.get('/', function (req, res) {
    res.send('REST type 0: using RPC  ')
})


// SOAP === REST LEVEL 0

app.post('/rpc', function (req, res, next) {
    var body = req.body
    var respond = function (err, response) {
        if (err) {
            res.send(JSON.stringify(err))
        } else {
            res.send(JSON.stringify(response))
        }
    }
    
    res.set('Content-type', 'application/json')

    switch (body.action) {  

        case "login" :
            // http post "$url/rpc" action=login username=jh password=123    
            // http post "$url/rpc" action=login username=jh password=jh    
                const  userID =  body.username
                const  userPWD = body.password

                console.log ( `login username: ${userID} pwd: ${userPWD} ` )
                if(userID === userPWD) 
                    respond(undefined , {message: "user and password is matching"  }) 
                else
                    respond(undefined , {message: "user and password is NOT matching"  }) 
                break

        case "getMovies":
            // http post "$url/rpc" action=getMovies     
            db.movies.find({}, respond)
            break

        case "addMovie":
            // http post "$url/rpc" action=addMovie title="The best movie ever for 2020"  
            db.movies.insert({ title: req.body.title }, respond)
            break

        case "rateMovie":
            // http post "$url/rpc" action=rateMovie title="The best movie ever for 2020" rating=5 
            db.movies.update({ title: body.title }, { $set: { rating: body.rating } }, function (err, num) {
                respond(err, { success: num + " records updated" })
            })
            break

        case "removeMovies":
            // http post "$url/rpc" action=removeMovies      
            db.movies.remove({} , { multi: true }, function(err, num){
            respond(err, { success: num + " records deleted" })
            })  
            
            break

            default:
                // http post "$url/rpc"     
                respond({ error: "No action given" })
        }

})