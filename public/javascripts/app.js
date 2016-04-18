var webapp = angular.module('webapp',['ui.router']);

webapp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('center')
	$stateProvider.state('center',{
		url:'/center',
		templateUrl:'/partials/center.html',
	}).state('login',{
		url:'/login',
		templateUrl:'/partials/login.html',
	}).state('reg',{
		url:'/reg',
		templateUrl:'/partials/reg.html',
	}).state('chat',{
		url:'/chat',
		templateUrl:'/partials/chat.html',
	}).state('user',{
		url:'/user',
		templateUrl:'/partials/user.html',
	}).state('userList',{
		url:'/userList',
		templateUrl:'/partials/userList.html',
	}).state('userInfo',{
		url:'/userInfo',
		templateUrl:'/partials/userInfo.html',
	}).state('addFriend',{
		url:'/addFriend',
		templateUrl:'/partials/addFriend.html',
	}).state('apply',{
		url:'/apply',
		templateUrl:'/partials/apply.html',
	}).state('other',{
		url:'/other',
		templateUrl:'/partials/err.html',
	})
}])