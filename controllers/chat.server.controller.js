var mongoose = require('../config/mongoose');
var moment = require('moment');
var Chat = mongoose.model('Chat');
var url = require('url');

module.exports = {
	getChatRecord: function(req,res,next){
		var arg = url.parse(req.url, true).query;
		Chat.find({'$or':[{'from':arg.fid,'to':req.session.userId},{'to':arg.fid,'from':req.session.userId}]},function(err,docs){
			if(err){
				return err;
			}else{
				res.end(JSON.stringify(docs));
			}
		})
	},
	getUnread: function(req, res, next){
		Chat.count(function(err,count){
			Chat.find({'$and':[{'isRead':0},{'to':req.session.userId}]},function(err,docs){
				if(err){
					return err;
				}else{
					res.end(JSON.stringify(docs));
				}
			})
		})
	},
	updateChatStatus: function(req, res, next){
		var arg = url.parse(req.url, true).query;
		console.log(arg.userId+"-------"+req.session.userId)
		Chat.update({from:arg.userId,to:req.session.userId},{$set:{isRead:1}},{multi:true},function(err,docs){
			console.log('已读');
		})
	}
}