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
        
        getGoing();
        
        
        $scope.getResults = function() {
            
            // make sure search bar isn't empty
            if($scope.searchTerm !== '') {
                
                // turn on loading animation
                $scope.loading = true;
                
                $http.get('/api/search?term=' + $scope.searchTerm)
                    .success(function(results) {
                    
                        $scope.loading = false;
                        $scope.data = results;
                    
                        getGoing();
                    
                        // store results in localStorage
                        localStorage.setItem('results', JSON.stringify(results));
                    })
                    .error(function(error) {
                        console.log('Error: ' + error);
                    });
            }
        }
        
        function getGoing() {
            if($scope.data.length > 0) {
                $scope.data.forEach(function(obj) {
                    var id = obj.id;

                    $http.get('/api/getgoing/' + id)
                    .success(function(data) {
                        obj.going = data.goings;
                        $scope.goingNo.push(obj.going);
                    });

                });
            }
        }
        
        $scope.addGoing = function(index) {
            
            // check if user is authenticated
            $http.get('/api/loggedin').success(function(user) {
                
                $scope.userid = user.user || 'empty';
                //$scope.userid = 'empty';
                
                $scope.formData.id = $scope.data[index].id;
                $scope.formData.user = $scope.userid;
                
                if($scope.userid != 'none') {
                    // user is logged on
                    if($scope.data[index].going > $scope.goingNo[index]) {
                        
                        // remove from db
                        $http.post('/api/removegoing', $scope.formData)
                            .success(function(data) {
                            
                                // if user has added to going, remove going when clicking again
                            
                                // these ifs prevent button spammers from bugging out the counter
                                if($scope.data[index].going - 1 >= $scope.goingNo[index])
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
                                    if($scope.data[index].going + 1 <= $scope.goingNo[index] + 1)
                                        $scope.data[index].going += 1;
                                }
                                else {
                                    // user has already added themselves to going, remove user
                                    $http.post('/api/removegoing', $scope.formData)
                                        .success(function(data) {
                                            if($scope.data[index].going - 1 >= $scope.goingNo[index])
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
            });
            
            
        }

    }])
    
    .controller('loginController', ['$scope', '$http', function($scope, $http) {
        
        $scope.loggedIn = false;
        
        $http.get('/api/loggedin').success(function(user) {
            if(user.user == 'none') {
                window.location = '/';
            }
            else {
                $scope.loggedIn = true;
                var results = localStorage.getItem('results');
                $scope.data = [];
                if(results != null) {
                    $scope.data = JSON.parse(results);
                }
                
            }
        });

        
    }])
    
    
    
    // directives
    .directive('results', function() {
        return {
            restrict: 'E',
            templateUrl: 'results.html'
        }
        
    });
    
})();