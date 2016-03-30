(function() {
    
    var app = angular.module('fccNight', []);





    //controllers
    app.controller('mainController', ['$scope', '$http', function($scope, $http) {

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
                    });
            }
        }
        
        $scope.addGoing = function(index) {
            // check if user is authenticated
            if($scope.data[index].going > $scope.goingNo[index]) {
                $scope.data[index].going -= 1;
            }
            else {
                $scope.data[index].going += 1;
            }
            // register in db
        }

    }]);
    

    


    // directives
    app.directive('results', function() {
        return {
            restrict: 'E',
            templateUrl: 'results.html'
        };
    });
    
})();