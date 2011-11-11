var thisClickTarget = null;
var lastClickTarget = null;
var thisClickTimestamp = 0;
var lastClickTimestamp = 0;

var cancelFollowClick = false;

function NoClickDelay(el) {
    this.element = el;
    this.element.addEventListener('touchstart', this, false);
        
    //this code stops the manual 2nd event from firing in some browsers 
    //when you consecutively click two buttons fast
    $('.key').each(function() {
        var el = $(this);

        var clickhandler = el.attr("onclick");
        
        el.attr("onclick", "return false;");

        // new click handler
        el.click(function(e) {
            cancelFollowClick = false;
            
            thisClickTarget = el;
            thisClickTimestamp = Date.now();
            
            if(thisClickTarget == lastClickTarget && thisClickTimestamp-lastClickTimestamp < 500) {
                e.preventDefault();
                e.stopPropagation();
                cancelFollowClick = true;
                return false;
            } else {
                lastClickTarget = thisClickTarget;
                lastClickTimestamp = thisClickTimestamp;
            }
        });
        
        if(clickhandler) {
            el.click(function(e) {
                if(!cancelFollowClick) {
                    clickhandler();
                }
            });
        }
    });
}

NoClickDelay.prototype = {
    handleEvent: function(e) {
        switch(e.type) {
            case 'touchstart':
                this.onTouchStart(e);
                break;
            case 'touchmove':
                this.onTouchMove(e);
                break;
            case 'touchend':
                this.onTouchEnd(e);
                break;
        }
    },
    onTouchStart: function(e) {
        
        this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        
        targetIsSelectElement = this.theTarget.tagName == "SELECT";
        
        if(!targetIsSelectElement) {
            e.preventDefault();
            
            if(this.theTarget.nodeType == 3) {
                this.theTarget = theTarget.parentNode;
            }
            this.checkTarget = this.theTarget;
            
            this.element.addEventListener('touchmove', this, false);
            this.element.addEventListener('touchend', this, false);
            this.element.addEventListener('touchcancel', this, false);
        }
    },
    onTouchCancel: function(e) {
        console.log("Touch cancel");  
    },
    onTouchMove: function(e) {
        //this.moved = true;
        this.checkTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if(this.checkTarget.nodeType == 3) this.checkTarget = this.checkTarget.parentNode;
    },
    onTouchEnd: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.element.removeEventListener('touchmove', this, false);
        this.element.removeEventListener('touchend', this, false);
        if(this.checkTarget == this.theTarget ) {
            var theEvent = document.createEvent('MouseEvents');
            
            theEvent.initEvent('click', true, true);
            this.theTarget.dispatchEvent(theEvent);
        }
        this.theTarget = undefined;
    }
};