function initTouch() {
    //replace all click events with touch events
    new NoClickDelay(document.body);  
    
    //hook up swipe     
    $('#wrapper').swipe({
        minSwipeLength: 250,
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
    
    //get rid of the webkit scrollbars
    var sheet = document.createElement('style')
    sheet.innerHTML = "::-webkit-scrollbar {display: none;}";
    document.body.appendChild(sheet);
}