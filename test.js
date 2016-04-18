var mongoose = require('./config/mongoose');
var moment = require('moment');

var User = mongoose.model('User');

User.find({},function(err,docs){
	console.log("竟来了")
	if(err){
		console.log(err);
		return
	}
	console.log(docs);
})