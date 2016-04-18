webapp.directive('popmsg',function(){
	return{
		restrict:'AECM',
		templateUrl:'/partials/msg.html',
		replace:true,
		link:function(){

		}
	}
});
webapp.directive('contenteditable',function(){
    return {
        restrict:'A',
        require:'?ngModel',
        link:function(scope,element,atrrs,ngModel){
            if(!ngModel)return;
            ngModel.$render=function(){
                element.html(ngModel.$viewValue||'');
            }
            element.on('blur keyup change', function() {
                scope.$apply(read);
            });
            function read() {
                var html = element.html();
                ngModel.$setViewValue(html);
            }
        }
    }
});
webapp.directive('checkloginstatus',['userStatus',function(userStatus){
    return {
        restrict:'AECM',
        replace:true,
        link:function($http){
            userStatus.getUserStatus();
        }
    }
}]);
