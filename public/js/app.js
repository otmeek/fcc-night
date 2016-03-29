(function() {
    
    var app = angular.module('fccNight', []);





    //controllers
    app.controller('mainController', ['$scope', '$http', function($scope, $http) {

        $scope.searchTerm = '';
        $scope.data = [];
        $scope.loading = false;
        
        $scope.getResults = function() {
            $scope.loading = true;
            $scope.data = [];
            if($scope.searchTerm !== '') {
                $http.get('/api/search?term=' + $scope.searchTerm)
                    .success(function(results) {
                        $scope.data = results;
                        $scope.loading = false;
                    });
            }
        }
        
        $scope.addGoing = function(index) {
            // check if user is authenticated
            $scope.data[index].going += 1;
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