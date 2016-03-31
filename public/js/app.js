(function() {
    
    angular.module('fccNight', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider

        .when('/', {
            templateUrl: 'default.html'
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
        $scope.data = JSON.parse(sessionStorage.getItem('results')) || [];
        $scope.loading = false;
        $scope.goingNo = [];
        $scope.formData = {};
        $scope.userid = '';
        
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
                        // store results in sessionStorage
                        sessionStorage.setItem('results', JSON.stringify(results));
                    })
                    .error(function(error) {
                        console.log('Error: ' + error);
                    });
            }
        }
        
        $scope.addGoing = function(index) {
            // check if user is authenticated
            $http.get('/api/loggedin').success(function(user) {
                $scope.userid = user.user;
                if($scope.userid != 'none') {
                    // user is logged on
                    if($scope.data[index].going > $scope.goingNo[index]) {
                        // if user has added to going, remove going when clicking again
                        $scope.data[index].going -= 1;
                        
                        // remove from db
                    }
                    else {
                        $scope.data[index].going += 1;
                        
                        // add to db
                        
                        $scope.formData.id = $scope.data[index].id;
                        var date = new Date();
                        $scope.formData.going = date;
                        $scope.formData.user = $scope.userid;
                        
                        console.log(JSON.stringify($scope.formData));
                        
//                        $http.post('/api/going', $scope.formData)
//                            .success(function(data) {
//                                $scope.formData = {};
//                            })
//                            .error(function(error) {
//                                console.log('Error: ' + error);
//                            })
                    }

                }
                else {
                    console.log('redirect');
                    window.location = '/login/twitter';
                }
            });
            
            
        }

    }])
    
    .controller('loginController', ['$scope', '$http', function($scope, $http) {
        
//        $scope.loggedIn = false;
//        
//        $http.get('/api/loggedin').success(function(user) {
//            if(user.user == 'none') {
//                window.location = '/';
//            }
//            else {
                $scope.loggedIn = true;
                var results = sessionStorage.getItem('results');
                $scope.data = [];
                if(results != null) {
                    $scope.data = JSON.parse(results);
                }
//                
//            }
//        });

        
    }])
    
    
    
    // directives
    .directive('results', function() {
        return {
            restrict: 'E',
            templateUrl: 'results.html'
        }
        
    });
    
})();