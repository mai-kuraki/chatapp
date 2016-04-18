var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
	from:String,
	to:String,
	time:Date,
	content:String,
	isRead:Number
})

mongoose.model('Chat',chatSchema);