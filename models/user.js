var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  name: String,
  someID: String,
  avatar: String,    
  images:[{
    imageAdress: String,
    description:String,
    avatar:String}]       
});


module.exports = mongoose.model('users', User);