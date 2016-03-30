var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    
    
    id: String,
    token: String,
    username: String,
    displayName: String
    
    
});

// create the model for users and export to app
module.exports = mongoose.model('User', userSchema);