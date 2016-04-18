webapp.controller('ParentCtrl',['$scope','addMsg',function($scope,addMsg){
	$scope.myId = '';
	$scope.myName = '';
	$scope.myHead = '';
	$scope.$on('getMyId',function(e,data){
		$scope.myId = data.myId;
		$scope.myName = data.myName;
		$scope.myHead = data.myHead;
	})
	$scope.$on('formCtrl',function(e,data){
		$scope.$broadcast(data.target,data.data);
	})
	socket.on('informClient',function(data){
		if(data['res']){
			$scope.$broadcast('socketSuccess');
		}else{
			$scope.$broadcast('popMsg',{resMsg:'发送失败'});
			$scope.$apply();
		}
	})
	socket.on('chatClient',function(data){
		addMsg.addReciveMsgView(data);
		myScroll.refresh();
		myScroll.scrollToElement(document.querySelector('.chat-item li:last-child'));
	})
}])

webapp.controller('loginCtrl',['$scope','$http','$state',function($scope,$http,$state){
	$scope.userName = "";
	$scope.pwd = "";
	$scope.login = function(){
		$http.post(
			'/dologin',
			{userName:$scope.userName,pwd:$scope.pwd}
		).success(function(data){
			if(data.res == true){
				$state.go('center');
			}
			socket.emit('setSocketId',data.myId);
			$scope.$emit('getMyId',data);
			$scope.$emit('formCtrl',{target:'popMsg',data:data});
		})
	}
	$scope.loginState = function(){
		$http.post(
			'/loginState',
			{}
		).success(function(data){
			if(data["loginState"]){
				$state.go('center');
			}
		})
	}
}]);

webapp.controller('regCtrl',['$scope','$http','$state',function($scope,$http,$state){
	$scope.userName = "";
	$scope.pwd1 = "";
	$scope.pwd2 = "";
	$scope.reg = function(){
		$http.post(
			'/doReg',
			{userName:$scope.userName,pwd1:$scope.pwd1,pwd2:$scope.pwd2}
		).success(function(data){
			if(data.res == true){
				$state.go('center');
			}
			$scope.$emit('formCtrl',{target:'popMsg',data:data});
		})
	}
}]);

webapp.controller('homeCtrl',['$scope','$http','$state',function($scope,$http,$state){
	$scope.userName = '';
	$scope.loginOut = function(){
		$http.post(
			'/loginOut',
			{}
		).success(function(data){
			if(data["res"]){
				$state.go('login');
			}
		})
	}
}])

webapp.controller('msgCtrl',['$scope',function($scope){
	$scope.resMsg = '';
	$scope.pop = function(time){
		$('.msg').show();
		setTimeout(function(){
			$('.msg').hide();
			$scope.resMsg = '';
		},time)
	}
	$scope.$on('popMsg',function(e,data){
		console.log(data.resMsg)
		$scope.resMsg = data.resMsg;
		$scope.pop(1500);
	})
}])

webapp.controller('chatItemCtrl',['$scope',function($scope){
	$scope.getChatRecord = function(){
		$http.post(
			// '/getChatRecord',
			// {}
		)
	}
	$scope.initHeight = function(){
		$("#wrapper").css("height",$(window).height() - 99 + "px");
	}
	$scope.initScroll = function(){
		$scope.initHeight();
		myScroll = new IScroll('#wrapper', { mouseWheel: true });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	}
	$(window).resize(function(){
		$scope.initHeight();
	})
}])

webapp.controller('sendCtrl',['$scope','addMsg',function($scope,addMsg){
	$scope.messageContent = '';
	$scope.send = function(obj){
		var friendId = $scope.friendId;
		var myId = $scope.myId;
		var friendName = $scope.friendName;
		if(!$scope.messageContent){
			$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'请输入内容'}});
			return false;
		}
		socket.send({
			content:$scope.messageContent,
			from:myId,to:friendId,
			userName:$scope.myName,
			userHead:$scope.myHead
		});
	}
	$scope.$on('socketSuccess',function(e,data){
		addMsg.addSendMsgView({
			content:$scope.messageContent,
			userName:$scope.myName,
			userHead:$scope.myHead
		});
		$scope.messageContent = '';
		$scope.$apply();
		myScroll.refresh();
		myScroll.scrollToElement(document.querySelector('.chat-item li:last-child'));
	})
}])

webapp.controller('userCtrl',['$scope','$http','ajaxfileupload','initUserInfo','$state',function($scope,$http,ajaxfileupload,initUserInfo,$state){
	$scope.iniUserCenter = function(){
		$(document).on('change','#headfile',function(){
			console.log("改不了")
            ajaxfileupload.setImagePreview(this,'',$('.userinfo-head'));
            ajaxfileupload.setWatingIco(true);
            ajaxfileupload.ajaxFileUpload('/uploadUserHead','headfile',$scope);
		})
		$http.get(
			'/getUserInfo'
		).success(function(data){
			console.log(data)
			initUserInfo.setData(data);
		})
	}
	$scope.loginOut = function(){
		$http.post(
			'/loginOut',
			{}
		).success(function(data){
			if(data["res"]){
				$state.go('login');
			}
		})
	}
}])

webapp.controller('userListCtrl',['$scope','$http','$state','toUserInfo','chatFriend',function($scope,$http,$state,toUserInfo,chatFriend){
	$scope.userListData = {};
	$scope.$on('updateMsgNum',function(data){
		console.log(data);
		for(var i in $scope.userListData){
			if($scope.userListData[i]._id == data.id){
				$scope.userListData[i].unRead += 1;
			}
		}
	})
	$scope.getUserList = function(){
		var unReadData;
		var friendData;
		$http.get(
			'/getUserList'
		).success(function(data){
			friendData = data;
			if(data.length > 0){
				$(".userItems").show();
				$http.get(
					'/getUnread'
				).success(function(data){
					unReadData = data;
					// console.log(unreadData)
					if(friendData){
						for(var i in friendData){
							friendData[i]["userHead"] = friendData[i]["userHead"].replace(/public/,"");
							friendData[i]["unRead"] = 0;
							for(var j in unReadData){
								if(friendData[i]["_id"] == unReadData[j]["from"]){
									friendData[i]["unRead"] += 1;
								}
							}
						}
						$scope.userListData = friendData;
						console.log(friendData);
					}
				})
			}else{
				$(".userItems").hide();
			}
			
		})
	}
	$scope.toUser = function(obj){
		var id = obj['item']._id;
		$http.get(
			'/getFriendInfo?userId=' + id
		).success(function(data){
			if(data){
				$state.go('userInfo');
				toUserInfo.setData(data);
			}
		})
	}
	$scope.toChat = function(obj){
		var id = obj['item']._id;
		// $scope.updateChatStatus(id);
		$http.get(
			'/toChatUser?userId=' + id
		).success(function(data){
			if(data){
				$state.go('chat');
				chatFriend.setData(data);
			}
		})
		
	}
	$scope.updateChatStatus = function(id){
		$http.get(
			'/updateChatStatus?userId=' + id
		).success(function(){
		})
	}
}])

webapp.controller('friendInfoCtrl',['$scope','$http','toUserInfo','$state','chatFriend',function($scope,$http,toUserInfo,$state,chatFriend){
	toUserInfo.getData();
	$scope.toChat = function(){
		$state.go('chat');
	}
	$scope.toFriend = function(){
		$state.go('apply');
	}
}])

webapp.controller('chatCtrl',['$scope','chatFriend','$http','addMsg',function($scope,chatFriend,$http,addMsg){
	var data = chatFriend.getData();
	$scope.friendName = '';
	$scope.userId = '';
	if(data){
		$scope.friendName = data.userName;
		$scope.friendId = data._id;
		$scope.friendHead = data.userHead;
		$http.get(
			'/getChatRecord?fid=' + $scope.friendId
		).success(function(data){
			console.log(data.length)
			addMsg.addChatRecord(data,$scope.friendName,$scope.myName,$scope.friendId,$scope.myId,$scope.friendHead.replace(/public/,""),$scope.myHead);
		})
	}
}])

webapp.controller('actionBarCtrl',['$scope',function($scope){
	$scope.menuShow = function(){
		$(".top-option").show();
		$(".menu-mask").show();
	}
	$scope.menuHide = function(){
		$(".top-option").hide();
		$(".menu-mask").hide();
	}
}])

webapp.controller('searchUserCtrl',['$scope','$http','$state','toUserInfo',function($scope,$http,$state,toUserInfo){
	$scope.searchUserData = {};
	$scope.searchVal = '';
	$scope.toSearch = function(){
		if($scope.searchVal){
			$http.get(
				'/toSearch?k=' + $scope.searchVal
			).success(function(data){
				if(data.length > 0){
					for(var i in data){
						if(data[i]["userHead"]){
							data[i]["userHead"] = data[i]["userHead"].replace(/public/,"");
						}
					}
					$scope.searchUserData = data;
					console.log(data);
					$(".userItems").show();
				}else{
					$(".userItems").hide();
					$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'没有相关用户'}});
				}
			})
		}else{
			$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'请输入搜索内容'}});
		}
	}
	$scope.toUser = function(obj){
		var id = obj['item']._id;
		$http.get(
			'/getFriendInfo?userId=' + id
		).success(function(data){
			if(data){
				$state.go('userInfo');
				toUserInfo.setData(data);
			}
		})
	}
}])

webapp.controller('applyCtrl',['$scope','$http','applyFriend',function($scope,$http,applyFriend){
	$scope.applyMsg = '你好，我是 ' + $scope.myName;
	var data = applyFriend.getData();
	$scope.applyUserName = data.userName;
	$scope.applyUserHead = data.userHead.replace(/public/,'');
	$scope.applyUserId = data._id;
	$scope.sendApply = function(){
		$http.post(
			'/sendApply',
			{myId:$scope.myId,myName:$scope.myName,toId:$scope.applyUserId,toName:$scope.applyUserName,applyMsg:$scope.applyMsg}
		).success(function(data){
			if(data['res'] == 1){
				$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'发送成功，等待对方确认'}});
			}else{
				$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'发送失败'}});
			}
		})
	}
}])