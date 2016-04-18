var express = require('express');
var router = express.Router();
var userServerControllers = require('../controllers/user.server.controller');
var chatServerControllers = require('../controllers/chat.server.controller');

router.get('/',function(req, res, next){
	res.render('base');
});
router.post('/loginState',function(req, res, next){
	userServerControllers.loginState(req, res, next);
});
router.post('/doLogin',function(req, res, next){
	userServerControllers.doLogin(req, res, next);
});
router.post('/doReg', function(req, res, next) {
  	userServerControllers.doReg(req, res, next);
});
router.post('/loginOut', function(req, res, next) {
  	userServerControllers.loginOut(req, res, next);
});
router.post('/sendMsg',function(req, res, next){
	userServerControllers.sendMsg(req, res, next);
})
router.get('/getChatRecord',function(req, res, next){
	chatServerControllers.getChatRecord(req, res, next);
})
router.post('/uploadUserHead',function(req, res, next){
	userServerControllers.uploadUserHead(req, res, next);
})
router.get('/getUserInfo',function(req, res, next){
	userServerControllers.getUserInfo(req, res, next);
})
router.get('/getFriendInfo',function(req, res, next){
	userServerControllers.getFriendInfo(req, res, next);
})
router.get('/toChatUser',function(req, res, next){
	userServerControllers.toChatUser(req, res, next);
})
router.get('/updateChatStatus',function(req, res, next){
	chatServerControllers.updateChatStatus(req, res, next);
})
router.get('/getUserList',function(req, res, next){
	userServerControllers.getUserList(req, res, next);
})
router.get('/getUnread',function(req, res, next){
	chatServerControllers.getUnread(req, res, next);
})
router.get('/toSearch',function(req, res, next){
	userServerControllers.toSearch(req, res, next);
})
router.post('/sendApply',function(req, res, next){
	userServerControllers.sendApply(req, res, next);
})


router.get('/test',function(req,res,next){
	res.render('test');
})
module.exports = router;
