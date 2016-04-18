var mongoose = require('../config/mongoose');
var moment = require('moment');
var User = mongoose.model('User');
var Chat = mongoose.model('Chat');
var formidable = require('formidable');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var fs = require('fs');
var url = require('url');

module.exports = {
	loginState: function(req,res,next){
		// console.log(req.session);
		if(req.session.userName){
			res.end(JSON.stringify({loginState:true,userName:req.session.userName,userId:req.session.userId}));
		}else{
			res.end(JSON.stringify({loginState:false}));
		}
	},
	login: function(req,res,next){
		if(req.session.userName){
			res.redirect('/');
		}else{
			res.render('login', { title: '用户登陆'});
		}
	},
	doLogin: function(req,res,next){
		var postData = req.body;
		if(!postData.userName || !postData.pwd){
			res.end(JSON.stringify({resMsg:'用户名密码不能为空',res:false}));
		}
		User.findOne({userName:postData.userName},function (err,docs){
			var resMsg = '';
			var isLogin = false;
			var myHead = '';
			if(docs){
				if(postData.pwd == docs.pwd){
					resMsg = '登陆成功';
					isLogin = true;
					req.session.userName = postData.userName;
					req.session.userId = docs._id;
					myHead = docs.userHead.replace(/public/,'');
				}else{
					resMsg = '用户名密码错误';
				}
			}else{
				resMsg = '用户不存在';
			}
			// console.log(myHead);
			res.end(JSON.stringify({
				resMsg:resMsg,
				res:isLogin,
				myId:req.session.userId,
				myName:req.session.userName,
				myHead:myHead
			}));
		})
	},
	doReg: function(req,res,next){
		var postData = req.body;
		if(!postData.userName || !postData.pwd1 || !postData.pwd2){
			return res.end(JSON.stringify({resMsg:'请填写完整信息',res:false}));
		}
		if(postData.pwd1 !== postData.pwd2){
			return res.end(JSON.stringify({resMsg:'请确认两次密码输入一致',res:false}));
		}
		User.findOne(postData,function(err,docs){
			if(!docs){
				var newUser = new User({
					userName:postData.userName,
					pwd:postData.pwd1,
					time:moment().format('L'),
					regType:'pc',
					userHead:''
				})
				var resMsg = '';
				var isReg = false;
				newUser.save(function(err,docs){
					// console.log(docs)
					if(!err){
						resMsg = '注册成功';
						isReg = true;
						req.session.userName = postData.userName;
						req.session.userId = docs._id;
					}else{
						resMsg = '注册失败';
					}
					res.end(JSON.stringify({resMsg:resMsg,res:isReg}));
				});
			}else{
				res.end(JSON.stringify({resMsg:'该用户名已被注册',res:false}));
			}
		})
	},
	find: function(postData,next){
		User.findOne({userName:postData.userName},function(err,docs){
			if(err){
				console.log(err);
				return
			}
			return next(docs);
		})
	},
	loginOut: function(req,res,next){
		req.session.userName = '';
		res.end(JSON.stringify({res:true}));
	},
	getUserInfo: function(req, res, next){
		User.findOne({_id:req.session.userId},{userHead:1,userName:1},function(err,docs){
			if(!err){
				res.end(JSON.stringify(docs));
			}
		})
	},
	getFriendInfo: function(req, res, next){
		var arg = url.parse(req.url, true).query;
		User.findOne({_id:arg.userId},{userHead:1,userName:1},function(err,docs){
			// console.log(docs);
			res.end(JSON.stringify(docs));
		})
	},
	toChatUser: function(req, res, next){
		var arg = url.parse(req.url, true).query;
		User.findOne({_id:arg.userId},{userHead:1,userName:1},function(err,docs){
			// console.log(docs);
			res.end(JSON.stringify(docs));
		})
	},
	uploadUserHead: function(req, res, next){
		// console.log(req.session)
	  	var form = new formidable.IncomingForm();   //创建上传表单
		    form.encoding = 'utf-8';        //设置编辑
		    form.uploadDir = 'public/uploads/images/';     //设置上传目录
		    form.keepExtensions = true;     //保留后缀
		    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
	  	form.parse(req, function(err, fields, files) {
		    if (err) {
		      	console.log(err);
		      	res.end(JSON.stringify({res:false}));
	    	}else{
	    		var imgPath = files.userHead.path;
	    		User.update(
	    			{_id:req.session.userId},
	    			{$set:{userHead:imgPath}},
	    			{safe:true},
	    			function(err,docs){
	    				// console.log(docs);
	    			});
	    		res.end(JSON.stringify({res:true,userHead:imgPath}));
	    	} 
	    	// console.log(files.userHead.name)
		    // var filename = files.name;
		    // console.log(filename)
		    // var str = String(new Date().getTime());
		    // var newName = md5.update(str).digest('hex');
		    // console.log(newName);
		  });
	},
	getUserList: function(req, res, next){
		if(req.session.userId){
			User.find({_id:req.session.userId},{friends:1},function(err,docs){
				if(!err){
					// console.log(docs[0].friends);
					var fidArr = [];
					for(var i in docs[0].friends){
						fidArr.push(docs[0].friends[i].friendId);
					}
					User.find({'_id':{'$in':fidArr}},{"userName":1,"userHead":1},function(err,docs){
						// console.log(docs);
						res.end(JSON.stringify(docs));
					})
				}
			})
		}
	},
	toSearch: function(req, res, next){
		var arg = url.parse(req.url, true).query;
		User.find({"userName": {$regex: arg.k, $options:'i'}},function(err,docs){
			if(!err){
				console.log(docs)
				res.end(JSON.stringify(docs));
			}
		})
	},
	sendApply: function(req, res, next){
		var postData = req.body;
		console.log(postData);
		User.update({'_id':req.session.userId},{'$push':{'friendApply':{'toId':postData.toId,'applyMsg':postData.applyMsg,status:0}}},function(erra,doca){
			if(!erra && doca.ok == 1){
				console.log(doca);
				User.update({'_id':postData.toId},{'$push':{'friendApply':{'fromId':req.session.userId,'applyMsg':postData.applyMsg,status:0}}},function(errb,docb){
					if(!errb && docb.ok == 1){
						res.end(JSON.stringify({'res':1}));
					}else{
						res.end(JSON.stringify({'res':0}));
					}
				})
			}else{
				res.end(JSON.stringify({'res':0}));
			}
		})
	}
}


mongoose.on('connected',function(){
	console.log('mongodb已连接');
})
mongoose.on('disconnected',function(){
	console.log('mongodb已断开连接');
})