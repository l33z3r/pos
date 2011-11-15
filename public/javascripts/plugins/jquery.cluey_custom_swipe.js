(function($) {
    $.fn.swipe = function(options) {
		
        // Default thresholds & swipe functions
        var defaults = {
            minSwipeLength: 100,
            swipeRight: function() {
                alert('swiped rightt')
            },
            swipeUp: function() {
                alert('swiped up')
            },
            swipeLeft: function() {
                alert('swiped left')
            },
            swipeDown: function() {
                alert('swiped down')
            }
        };
		
        var options = $.extend(defaults, options);
		
        if (!this) return false;
		
        return this.each(function() {
			
            var me = $(this)
			
            // Private variables for each element
            var originalCoord = {
                x: 0, 
                y: 0
            }
            var finalCoord = {
                x: 0, 
                y: 0
            }
            
            // Swipe was started
            function touchStart(event) {
                //console.log('Starting swipe gesture...')
                originalCoord.x = event.targetTouches[0].pageX
                originalCoord.y = event.targetTouches[0].pageY

                finalCoord.x = originalCoord.x
                finalCoord.y = originalCoord.y
            }
			
            // Store coordinates as finger is swiping
            function touchMove(event) {
                event.preventDefault();
                finalCoord.x = event.targetTouches[0].pageX // Updated X,Y coordinates
                finalCoord.y = event.targetTouches[0].pageY
            }
			
            // Done Swiping
            // Swipe should only be on X axis, ignore if swipe on Y axis
            // Calculate if the swipe was left or right
            function touchEnd(event) {
                //console.log('Ending swipe gesture...')
                
                var x1 = originalCoord.x;
                var y1 = originalCoord.y;
                
                var x2 = finalCoord.x;
                var y2 = finalCoord.y;
                
                var dir = getSwipeDirection(x1, y1, x2, y2, defaults.minSwipeLength);
                
                switch(dir) {
                    case 0: {
                        //alert("swipe too short");
                        break;
                    }
                    case 1: {
                        defaults.swipeRight();
                        break;
                    }
                    case 2: {
                        defaults.swipeUp();
                        break;
                    }
                    case 3: {
                        defaults.swipeLeft();
                        break;
                    }
                    case 4: {
                        defaults.swipeDown();
                        break;
                    }
                    default: {
                        console.log("Weird!!!");
                    }
                }
            }
			
            // Swipe was canceled
            function touchCancel(event) { 
            //console.log('Canceling swipe gesture...')
            }
			
            // Add gestures to all swipable areas
            this.addEventListener("touchstart", touchStart, false);
            this.addEventListener("touchmove", touchMove, false);
            this.addEventListener("touchend", touchEnd, false);
            this.addEventListener("touchcancel", touchCancel, false);
				
        });
    };
})(jQuery);

//returns a number 1-4 indicating swipe direction, or zero if the threshold was not passed
//0 = no swipe
//1 = right swipe
//2 = up swipe
//3 = left swipe
//4 = down swipe
function getSwipeDirection(x1, y1, x2, y2, thresholdSwipeLength) {
    //translate (x1, y1) to (0, 0)
    
    var x2t = x2 - x1;
    var y2t = y2 - y1;
    
    //alias vars for comprehension
    var x = x2t;
    var y = y2t;
    
    var thisSwipeLength = Math.sqrt((x*x) + (y*y));
    //console.log("SL: " + thisSwipeLength + " TSL: " + thresholdSwipeLength);
    
    //is the swipe long enough?
    if(thisSwipeLength < thresholdSwipeLength) {
        return 0;
    } else {
        if(x>=0) {
            //right hand side of plane
            if(y<0) {
                //top right of plane
                if(Math.abs(x)>=Math.abs(y)) {
                    //right swipe
                    return 1;
                } else {
                    //up swipe
                    return 2;
                }
            } else {
                //bottom right of plane
                if(Math.abs(x)>=Math.abs(y)) {
                    //right swipe
                    return 1;
                } else {
                    //down swipe
                    return 4;
                }
            }
        } else {
            //left hand side of plane
            if(y<0) {
                //top left of plane
                if(Math.abs(x)>=Math.abs(y)) {
                    //left swipe
                    return 3;
                } else {
                    //up swipe
                    return 2;
                }
            } else {
                //bottom left of plane
                if(Math.abs(x)>=Math.abs(y)) {
                    //left swipe
                    return 3;
                } else {
                    //down swipe
                    return 4;
                }
            }
        }
    }
}