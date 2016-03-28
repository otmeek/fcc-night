// setup ==============================================
var express    = require('express');
var mongoose   = require('mongoose');
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var yelp       = require('yelp');

var app = express();
require('dotenv').load();

// config =============================================
mongoose.connect(process.env.MONGOLAB_URI);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// listen =============================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});