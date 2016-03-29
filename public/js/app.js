(function() {
    
    var app = angular.module('fccNight', []);

    var data = [
        {
            name: "Northern Lights",
            review: "Top review goes here",
            image: 'https://placehold.it/150x150',
            going: 3
        },
        {
            name: "Lisbon Cafe",
            review: "Top review goes here",
            image: 'https://placehold.it/150x150',
            going: 2
        }
    ];




    //controllers
    app.controller('mainController', function($scope) {

        $scope.searchTerm = '';

        $scope.getResults = function() {
            if($scope.searchTerm !== '') {
                alert($scope.searchTerm);
            }
        }
        
    });

    app.controller('resultsController', function($scope) {
        $scope.data = data;
        
        $scope.addGoing = function(index) {
            // check if user is authenticated
            $scope.data[index].going += 1;
            // register in db
        }
    });




    // directives
    app.directive('results', function() {
        return {
            restrict: 'E',
            templateUrl: 'results.html',
            controller: 'resultsController'
        };
    });
    
})();