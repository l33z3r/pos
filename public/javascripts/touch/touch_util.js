
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
    
    //set the first page in the swipes to be the menu
    var menuPageNum = 1;
    $('#content-scroll').attr('scrollLeft', menuPageNum * pageWidth);
}







//cant remember what the following code was actually used for



//var lastTap = null;
//
//function initTouch2() {
//        
//    //jquery touch ui plugin init
//
//    $.extend($.support, {
//        touch: "ontouchend" in document
//    });
//
//    // Hook up touch events
//    $.fn.addTouch = function() {
//        if ($.support.touch) {
//            this.each(function(i,el){
//                el.addEventListener("touchstart", iPadTouchHandler, false);
//                el.addEventListener("touchmove", iPadTouchHandler, false);
//                el.addEventListener("touchend", iPadTouchHandler, false);
//                el.addEventListener("touchcancel", iPadTouchHandler, false);
//            });
//        }
//    };
//}