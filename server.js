// setup ==============================================
var express         = require('express');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var Yelp            = require('yelp');
var passport        = require('passport');
var TwitterStrategy = require("passport-twitter").Strategy;
var session         = require('express-session');
var uuid            = require('uuid');
var cookieParser    = require('cookie-parser');
var User            = require('./models/user');
var Location        = require('./models/location');

var app = express();
require('dotenv').load();

var yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMERKEY,
    consumer_secret: process.env.YELP_CONSUMERSECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKENSECRET,
});

// config =============================================
mongoose.connect(process.env.MONGOLAB_URI);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(null, user);
    });
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.APP_URL + '/login/twitter/callback'
  }, function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
        User.findOne({ id: profile.id }, function(err, user) {
            if(err)
                return done(err);
            
            if(user) {
                return done(null, user);
            }
            else {
                var newUser         = new User();
                newUser.id          = profile.id;
                newUser.token       = token;
                newUser.username    = profile.username;
                newUser.displayName = profile.displayName;
                
                newUser.save(function(err) {
                    if(err) throw err;
                    return done(null, newUser);
                });
            }
        });
    });
  }
));

app.use(cookieParser());
app.use(session({
    genid: function(req) {
        return uuid.v4();
    },
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// routes =============================================
var isLoggedIn = function (req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.json({user: 'none'});
}

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/callback', passport.authenticate('twitter', {
    successReturnToOrRedirect: '/loginsuccessful',
    failureRedirect: '/failedlogin'
}));

app.get('/api/loggedin', isLoggedIn, function(req, res) {
    res.json({ user: req.user.id });
});

app.get('/api/search', function(req, res) {
    var location = req.query.term;
    yelp.search({
        term: 'bars',
        location: location
    }).then(function(data) {
        var results = [];
        
        for(var i = 0; i < data.businesses.length; i++) {
            
            // query db to find going for each result
            
            var obj = {
                rating: data.businesses[i].rating,
                name: data.businesses[i].name,
                url: data.businesses[i].url,
                text: data.businesses[i].snippet_text,
                image: data.businesses[i].image_url,
                id: data.businesses[i].id,
                going: 0
            };
            results.push(obj);
        }
        
        res.json(results);
    });
});

app.get('/api/getgoing/:ID', function(req, res) {
    var id = req.params.ID;
    var today = new Date().setHours(0,0,0,0);
    
    Location.find({
        id: id,
        "going.going" : today
    }, function(err, doc) {
        if(err) throw err;
        res.json({ goings: doc.length });
    });
});

app.post('/api/going', function(req, res) {
    
    // need to check if user is already going today
    var today = new Date().setHours(0,0,0,0);
    
    Location.find({ 
        id: req.body.id,
        going: {
            $in: [{
                going: today,
                user: req.body.user
            }]
        }
    }).lean().exec(function(err, doc) {
        if(err) throw err;
        if(doc.length == 0) {
            
            Location.update(
            {
                id: req.body.id
            },
            {
                id: req.body.id,
                $push: 
                {
                    going: 
                    {
                        going: today,
                        user: req.body.user
                    }
                }
            },
            {
                upsert: true
            }, function(err, doc) {
                if(err) throw err;
                res.json({ message: 'done' });
            });
        }
        else {
            res.json({ message: 'error' });
        }
    });

    
});

app.post('/api/removegoing', function(req, res) {
    var today = new Date().setHours(0,0,0,0);
    Location.update(
        {
            id: req.body.id
        },
        {
            $pull:
            {
                going:
                {
                    going: today,
                    user: req.body.user
                }
            }
        }, function(err, doc) {
            if(err) throw err;
            res.json(doc);
            console.log(doc)
        }
    )
    
});

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('public/index.html', { root: __dirname });
});

// listen =============================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});