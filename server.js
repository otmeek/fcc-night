// setup ==============================================
var express    = require('express');
var mongoose   = require('mongoose');
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var Yelp       = require('yelp');

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
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// routes =============================================

app.get('/api/search', function(req, res) {
    var location = req.query.term;
    yelp.search({
        term: 'bars',
        location: location
    }).then(function(data) {
        var results = [];
        
        for(var i = 0; i < data.businesses.length; i++) {
            var obj = {
                rating: data.businesses[i].rating,
                name: data.businesses[i].name,
                url: data.businesses[i].url,
                text: data.businesses[i].snippet_text,
                image: data.businesses[i].image_url,
                id: data.businesses[i].id,
                going: 0 //change to db query
            };
            results.push(obj);
        }
        
        res.json(results);
    });
});

app.get('/*', function(req, res) {
    res.redirect('/');
});

// listen =============================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});