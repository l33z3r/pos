function NoClickDelay(el) {
    this.element = typeof el == 'object' ? el : document.getElementById(el);
    this.element.addEventListener('touchstart', this, false);
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
        
        //e.stopPropagation();
        //this.moved = false;
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
        }
    },
    onTouchMove: function(e) {
        //this.moved = true;
        this.checkTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if(this.checkTarget.nodeType == 3) this.checkTarget = this.checkTarget.parentNode;
    },
    onTouchEnd: function(e) {
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

