var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userName:String,
	pwd:String,
	time:Date,
	regType:String,
	userHead:String,
	friends:[{
		friendId:String
		}],
	friendApply:[{
		toId:String,
		fromId:String,
		applyMsg:String,
		status:Number
	}]
})

mongoose.model('User',userSchema);