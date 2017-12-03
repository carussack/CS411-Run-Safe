var express = require('express');
var router = express.Router();
var spotcrime = require('spotcrime');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://RunSafe:411@runsafe-shard-00-00-jztgt.mongodb.net:27017,runsafe-shard-00-01-jztgt.mongodb.net:27017,runsafe-shard-00-02-jztgt.mongodb.net:27017/test?ssl=true&replicaSet=RunSafe-shard-0&authSource=admin";
//var uri = "mongodb://localhost:3000/RunSafe"

router.post('/routes', function(req, res, next) {
// somewhere near phoenix, az
    var loc = {
        lat: req.body.lat,
        lon: req.body.lon
    };


    var radius = 0.02; // this is miles

    spotcrime.getCrimes(loc, radius, function(err, crimes){
        console.log(crimes)
        // res.json(crimes)
        res.render('index', {crimes: crimes})
    });
});

router.post('/', function(req, res, next) {
    var user = {
        //'username': req.body.first_name + " " + req.body.last_name,
        'username': req.body.username,
        'email': req.body.email,
        'gender': req.body.gender,
        'age': req.body.age,
        'height': req.body.feet + "'" + req.body.inches,
        'weight': req.body.weight
    };

    MongoClient.connect(uri, function(err, db) {

        if (err) throw err;
        db.collection("Users").insertOne(user, function(err, res) {
            if (err) throw err;
            console.log("1 user inserted");
            db.close();
        });
    });

    res.redirect("routes.html")
});

router.get('/profile', function(req, res) {

    MongoClient.connect(uri, function (err, db) {

        db.collection('Users', function (err, collection) {

            collection.find().toArray(function(err, items) {
                if(err) throw err;
                console.log(items);
            });

        });

    });

    res.render('index', {user: users});
});


/*router.post('/favorites', function(req, res, next) {
    var route = {
        'Name': req.body.route_name,
        'Distance': req.body.distance,
        'Route': req.body.link
    };

    MongoClient.connect(uri, function(err, db) {

        if (err) throw err;
        db.collection("Favorite Routes").insertOne(route, function(err, res) {
            if (err) throw err;
            console.log("Route saved");
            db.close();
        });
    });

    res.redirect("profile.html")
    //res.render('index', {'user':user});
});
*/

module.exports = router