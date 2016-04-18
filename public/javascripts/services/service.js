webapp.service('addMsg',function(){
	this.addSendMsgView = function(data){
		$(".chat-item").append("<li class='right-item clearfix'>"+
			"<div class='user-head-pic'><img src='"+ data.userHead +"'></div>"+
			"<div class='chat-detail'>"+
				"<div class='user-name clearfix'><span>"+ data.userName +"</span></div>"+
				"<div class='chat-content'>"+ data.content +"</div>"+
			"</div>"+
		"</li>");
	}
	this.addReciveMsgView = function(data){
		console.log(data)
		$(".chat-item").append("<li class='left-item clearfix'>"+
			"<div class='user-head-pic'><img src='"+ data.myHead +"'></div>"+
			"<div class='chat-detail'>"+
				"<div class='user-name clearfix'><span>"+ data.userName +"</span></div>"+
				"<div class='chat-content'>"+ data.content +"</div>"+
			"</div>"+
		"</li>");
	}
	this.addChatRecord = function(data,fname,mname,fid,mid,fhead,mhead){
		for(var i in data){
			if(data[i]["from"] == fid){
				$(".chat-item").append("<li class='left-item clearfix'>"+
					"<div class='user-head-pic'><img src='"+ fhead +"'></div>"+
					"<div class='chat-detail'>"+
						"<div class='user-name clearfix'><span>"+ fname +"</span></div>"+
						"<div class='chat-content'>"+ data[i]["content"] +"</div>"+
					"</div>"+
				"</li>");
			}else{
				$(".chat-item").append("<li class='right-item clearfix'>"+
					"<div class='user-head-pic'><img src='"+ mhead +"'></div>"+
					"<div class='chat-detail'>"+
						"<div class='user-name clearfix'><span>"+ mname +"</span></div>"+
						"<div class='chat-content'>"+ data[i]["content"] +"</div>"+
					"</div>"+
				"</li>");
			}
		}
		myScroll.refresh();
		// myScroll.scrollToElement(document.querySelector('.chat-item li:last-child',0));
		var iniH = $(".chat-item").height() - $(".content-window").height() + 24;
		myScroll.scrollTo(0, -iniH, 0);
	}
})
webapp.service('ajaxfileupload',function(){
	this.setImagePreview = function(docObj, localImagId, imgObjPreview){
		if (docObj.files && docObj.files[0]) {
		    //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
		    imgObjPreview.attr("src", window.URL.createObjectURL(docObj.files[0]));
		}
		return true;
	}
	this.setWatingIco = function(status){
		if(status){
			$(".wating-tip").show();
		}else{
			$(".wating-tip").hide();
		}
	}
	this.ajaxFileUpload  = function(url, id, $scope){
		$.ajaxFileUpload({
            url: url,
            type: 'post',
            secureuri: false, //一般设置为false
            fileElementId: id, // 上传文件的id、name属性名
            dataType: 'josn', //返回值类型，一般设置为json、application/json
            elementIds: "", //传递参数到服务器
            data: {},
            success: function (data, status) {
            	$(".wating-tip").hide();
                if(data.res == true){
                	var userHead = data.userHead.replace(/public/,"");
                	// $(".userinfo-head").attr("src",userHead);
                	$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'上传成功'}});
                }else{
                	$scope.$emit('formCtrl',{target:'popMsg',data:{resMsg:'上传失败'}});
                }
                $scope.$apply();
            }
            // error: function (data, status, e) {
            // }
        });
	}
})
webapp.service('initUserInfo',function(){
	this.setData = function(data){
		if(data){
			$(".userinfo-head").attr("src",data.userHead.replace(/public/,""));
			$(".niki-name").text(data.userName);
			$(".userId").text(data._id);
		}
		
	}
})
webapp.service('userStatus',['$http','$state',function($http,$state){
	this.getUserStatus = function(){
		$http.post(
			'/loginState'
			).success(function(data){
				if(data.loginState == false){
					$state.go('login');
				}else{
					// socket.emit('setSocketId',data.userId);
				}
			})
	}
}])
webapp.service('toUserInfo',['$state','chatFriend','applyFriend',function($state,chatFriend,applyFriend){
	this.data,
	this.setData = function(data){
		this.data = data;
	},
	this.getData = function(){
		var data = this.data;
		if(data._id){
			console.log(data)
			$(".userinfo-head").attr("src",data.userHead.replace(/public/,""));
			$(".niki-name").text(data.userName);
			$(".userId").text(data._id);
			$(".to-chat").attr("ng-click","toChat(" + data._id + ")");
			$(".to-friend").attr("ng-click","toFriend(" + data._id + ")");
			chatFriend.setData(data);
			applyFriend.setData(data);
		}else{
			$state.go('userList');
		}
	}
}])
webapp.service('chatFriend',function(){
	this.data,
	this.setData = function(data){
		this.data = data;
	}
	this.getData = function(){
		return this.data;
	}
})
webapp.service('applyFriend',function(){
	this.data,
	this.setData = function(data){
		this.data = data;
	}
	this.getData = function(){
		return this.data;
	}
})