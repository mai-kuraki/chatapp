var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){
	db = mongoose.createConnection(config.mongodb);
	require('../models/user.server.model');
	require('../models/chat.server.model');
	return db;
}();


