$(document).ready(function() {
    
    // this element starts out hidden because ng-show takes a second to kick in sometimes and it looks ugly
    $('.loading').removeClass('hidden');
    
    // add form behaviour to input. (when user presses enter while typing on the search bar, it triggers the ng-href function of the Go button)
    $('#inputSearch').bind('keyup', function(e) {
        if ( e.keyCode === 13 ) { // 13 is enter key
            angular.element('#mainController').scope().getResults();
        }
    });

    
});