var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    
    
    id: String,
    going: [
        {
            going: String,
            user: String
        }
    ]
    
    
});

// create the model for users and export to app
module.exports = mongoose.model('Location', locationSchema);