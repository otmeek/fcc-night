(function() {
    
    angular.module('fccNight', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider

        .when('/', {
            templateUrl: 'results.html'
        })
        .when('/failedlogin', {
            templateUrl: 'loginfailed.html'
        })
        .when('/loginsuccessful', {
            templateUrl: 'loginsuccessful.html',
            controller: 'loginController'
        })
        .otherwise({ redirectTo: '/' });
        
    })
    



    //controllers
    .controller('mainController', ['$scope', '$http', function($scope, $http) {

        $scope.searchTerm = '';
        $scope.data = [];
        $scope.loading = false;
        $scope.goingNo = [];
        
        $scope.getResults = function() {
            if($scope.searchTerm !== '') {
                $scope.loading = true;
                $scope.data = [];
                $http.get('/api/search?term=' + $scope.searchTerm)
                    .success(function(results) {
                        $scope.loading = false;
                        $scope.data = results;
                        for(var i = 0; i < $scope.data.length; i++) {
                            $scope.goingNo.push($scope.data[i].going);
                        }
                        // store results in localStorage
                        localStorage.setItem('results', JSON.stringify(results));
                    });
            }
        }
        
        $scope.addGoing = function(index) {
            // check if user is authenticated
            $http.get('/api/loggedin').success(function(user) {
                if(user.user != 'none') {
                    if($scope.data[index].going > $scope.goingNo[index]) {
                        $scope.data[index].going -= 1;
                    }
                    else {
                        $scope.data[index].going += 1;
                    }
                    
                    // register in db
                }
                else {
                    console.log('redirect');
                    window.location = '/login/twitter';
                }
            });
            
            
        }

    }])
    
    .controller('loginController', ['$scope', function($scope) {
        
        var results = localStorage.getItem('results');
        $scope.data = [];
        if(results != null) {
            $scope.data = JSON.parse(results);
        }
        
    }])
    
    
    
    // directives
    .directive('results', function() {
        return {
            restrict: 'E',
            templateUrl: 'results.html'
        }
        
    });
    
})();