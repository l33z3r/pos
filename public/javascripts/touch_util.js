var lastTap = null;

function initTouch() {
    //jquery touch ui plugin init

    $.extend($.support, {
        touch: "ontouchend" in document
    });

    // Hook up touch events
    $.fn.addTouch = function() {
        if ($.support.touch) {
            this.each(function(i,el){
                el.addEventListener("touchstart", iPadTouchHandler, false);
                el.addEventListener("touchmove", iPadTouchHandler, false);
                el.addEventListener("touchend", iPadTouchHandler, false);
                el.addEventListener("touchcancel", iPadTouchHandler, false);
            });
        }
    };
}