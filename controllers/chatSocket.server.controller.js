var mongoose = require('../config/mongoose');
var moment = require('moment');
var Chat = mongoose.model('Chat');

module.exports = function chatSocket(socket,io){
	socket.on('disconnect',function(){
		console.log('-----------socket已断开-----------');
	})
	socket.on('setSocketId',function(id){
		socket.nsp.sockets[id] = socket.nsp.sockets[socket.id];
	})
    socket.on('message', function (data) {
    	console.log(data);
        var newChat = new Chat({
			from:data.from,
			to:data.to,
			time:moment().format('L'),
			content:data.content,
			isRead:0
		})
		newChat.save(function(err,docs){
			console.log(docs)
			if(err){
				socket.emit('informClient',{resMsg:'发送失败',res:false});
			}else{
				socket.emit('informClient',{resMsg:'发送成功',res:true});
				var sid = data.to;
				socket.nsp.sockets[sid].emit('chatClient',{content:data.content,userName:data.userName,myHead:data.userHead});
				// socket.emit('updateMsgNum',{id:data.from});
			}
		})
    });
}