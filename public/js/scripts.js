$(document).ready(function() {
    
    $('#inputSearch').bind('keyup', function(e) {

        if ( e.keyCode === 13 ) { // 13 is enter key

            angular.element('#mainController').scope().getResults();
            

        }

    });
    
});