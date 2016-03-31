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
        $scope.data = JSON.parse(localStorage.getItem('results')) || [];
        $scope.loading = false;
        $scope.goingNo = [];
        // populate goingNo if there are results stored in localStorage
        if($scope.data.length > 0) {
            for(var j = 0; j < $scope.data.length; j++) {
                $scope.goingNo.push($scope.data[j].going);
            }
        }
        $scope.formData = {};
        $scope.userid = '';
        
        console.log($scope.data[0].going);
        
        $scope.getResults = function() {
            if($scope.searchTerm !== '') {
                $scope.loading = true;
                $scope.data = [];
                $http.get('/api/search?term=' + $scope.searchTerm)
                    .success(function(results) {
                        $scope.loading = false;
                        $scope.data = results;
                    
                        for(var i = 0; i < $scope.data.length; i++) {
                            //$scope.data[i].going = $scope.getGoing($scope.data[i].id);
                            console.log($scope.data[i].going);
                            $scope.goingNo.push($scope.data[i].going);
                        }
                        // store results in localStorage
                        localStorage.setItem('results', JSON.stringify(results));
                    })
                    .error(function(error) {
                        console.log('Error: ' + error);
                    });
            }
        }
        
        $scope.getGoing = function(id) {
            $http.get('/api/getgoing/' + id)
                .success(function(data) {
                    console.log(data.goings);
                    return data.goings;
                });
        }
        
        $scope.addGoing = function(index) {
            
            // check if user is authenticated
           // $http.get('/api/loggedin').success(function(user) {
                
                //$scope.userid = user.user || 'empty';
                $scope.userid = 'empty';
                
                $scope.formData.id = $scope.data[index].id;
                $scope.formData.user = $scope.userid;
                
                if($scope.userid != 'none') {
                    // user is logged on
                    if($scope.data[index].going > $scope.goingNo[index]) {
                        
                        // remove from db
                        $http.post('/api/removegoing', $scope.formData)
                            .success(function(data) {
                            
                                // if user has added to going, remove going when clicking again
                                $scope.data[index].going -= 1;
                            
                            })
                            .error(function(error) {
                                console.log('Error: ' + error);
                            });
                        
                    }
                    else {
                                                
                        // add to db
                        
                        // post request
                        $http.post('/api/going', $scope.formData)
                            .success(function(data) {
                            
                                if(data.message == 'done') {
                                    $scope.formData = {};
                                    $scope.data[index].going += 1;
                                }
                                else {
                                    $http.post('/api/removegoing', $scope.formData)
                                        .success(function(data) {
                                            $scope.data[index].going -= 1;
                                        })
                                        .error(function(error) {
                                            console.log('Error: ' + error);
                                        });
                                    
                                    
                                }
                            })
                            .error(function(error) {
                                console.log('Error: ' + error);
                            });
                    }

                }
                else {
                    window.location = '/login/twitter';
                }
         //   });
            
            
        }

    }])
    
    .controller('loginController', ['$scope', '$http', function($scope, $http) {
//        
//        $scope.loggedIn = false;
//        
//        $http.get('/api/loggedin').success(function(user) {
//            if(user.user == 'none') {
//                window.location = '/';
//            }
//            else {
                $scope.loggedIn = true;
                var results = localStorage.getItem('results');
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