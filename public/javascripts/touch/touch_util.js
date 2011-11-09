
function initTouch() {
    //replace all click events with touch events
    new NoClickDelay(document.body);  
    
    //hook up swipe     
    $('#wrapper').swipe({
        threshold: {
            x: 300,
            y: 200
        },
        swipeLeft: function() {
            swipeLeftHandler();
        },
        swipeRight: function() {
            swipeRightHandler();
        }
    });
}