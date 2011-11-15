
function initTouch() {
    //replace all click events with touch events
    new NoClickDelay(document.body);  
    
    //hook up swipe     
    $('#wrapper').swipe({
        minSwipeLength: 150,
        swipeRight: function() {
            swipeRightHandler();
        },
        swipeUp: function() {
            swipeUpHandler();
        },
        swipeLeft: function() {
            swipeLeftHandler();
        },
        swipeDown: function() {
            swipeDownHandler();
        }
    });
}