/*!
// iPhone-style Checkboxes jQuery plugin
// Copyright Thomas Reynolds, licensed GPL & MIT
*/
;(function($, iphoneStyle) {

// Constructor
$[iphoneStyle] = function(elem, options) {
  this.$elem = $(elem);
  
  // Import options into instance variables
  var obj = this;
  $.each(options, function(key, value) {
    obj[key] = value;
  });
  
  // Initialize the control
  this.wrapCheckboxWithDivs();
  this.attachEvents();
  this.disableTextSelection();
  
  if (this.resizeHandle)    { this.optionallyResize('handle'); }
  if (this.resizeContainer) { this.optionallyResize('container'); }
  
  this.initialPosition();
};

$.extend($[iphoneStyle].prototype, {
  // Wrap the existing input[type=checkbox] with divs for styling and grab DOM references to the created nodes
  wrapCheckboxWithDivs: function() {
    this.$elem.wrap('<div class="' + this.containerClass + '" />');
    this.container = this.$elem.parent();
    
    this.offLabel  = $('<label class="'+ this.labelOffClass +'">' +
                         '<span>'+ this.uncheckedLabel +'</span>' +
                       '</label>').appendTo(this.container);
    this.offSpan   = this.offLabel.children('span');
    
    this.onLabel   = $('<label class="'+ this.labelOnClass +'">' +
                         '<span>'+ this.checkedLabel +'</span>' +
                       '</label>').appendTo(this.container);
    this.onSpan    = this.onLabel.children('span');
    
    this.handle    = $('<div class="' + this.handleClass + '">' +
                         '<div class="' + this.handleRightClass + '">' +
                           '<div class="' + this.handleCenterClass + '" />' +
                         '</div>' +
                       '</div>').appendTo(this.container);
  },
  
  // Disable IE text selection, other browsers are handled in CSS
  disableTextSelection: function() {
    if (!$.browser.msie) { return; }

    // Elements containing text should be unselectable
    $.each([this.handle, this.offLabel, this.onLabel, this.container], function() {
      $(this).attr("unselectable", "on");
    });
  },
  
  // Automatically resize the handle or container
  optionallyResize: function(mode) {
    var onLabelWidth  = this.onLabel.width(),
        offLabelWidth = this.offLabel.width();
        
    if (mode == 'container') {
      var newWidth = (onLabelWidth > offLabelWidth) ? onLabelWidth : offLabelWidth;
      newWidth += this.handle.width() + 15; 
    } else { 
      var newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
    }
    
    this[mode].css({ width: newWidth });
  },
  
  attachEvents: function() {
    var obj = this;
    
    // A mousedown anywhere in the control will start tracking for dragging
    this.container
      .bind('mousedown touchstart', function(event) {          
        event.preventDefault();
        
        if (obj.$elem.is(':disabled')) { return; }
          
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        $[iphoneStyle].currentlyClicking = obj.handle;
        $[iphoneStyle].dragStartPosition = x;
        $[iphoneStyle].handleLeftOffset  = parseInt(obj.handle.css('left'), 10) || 0;
        $[iphoneStyle].dragStartedOn     = obj.$elem;
      })
    
      // Utilize event bubbling to handle drag on any element beneath the container
      .bind('iPhoneDrag', function(event, x) {
        event.preventDefault();
        
        if (obj.$elem.is(':disabled')) { return; }
        if (obj.$elem != $[iphoneStyle].dragStartedOn) { return; }
        
        var p = (x + $[iphoneStyle].handleLeftOffset - $[iphoneStyle].dragStartPosition) / obj.rightSide;
        if (p < 0) { p = 0; }
        if (p > 1) { p = 1; }
        obj.handle.css({ left: p * obj.rightSide });
        obj.onLabel.css({ width: p * obj.rightSide + 4 });
        obj.offSpan.css({ marginRight: -p * obj.rightSide });
        obj.onSpan.css({ marginLeft: -(1 - p) * obj.rightSide });
      })
    
        // Utilize event bubbling to handle drag end on any element beneath the container
      .bind('iPhoneDragEnd', function(event, x) {
        if (obj.$elem.is(':disabled')) { return; }
        
        var checked;
        if ($[iphoneStyle].dragging) {
          var p = (x - $[iphoneStyle].dragStartPosition) / obj.rightSide;
          checked = (p < 0) ? Math.abs(p) < 0.5 : p >= 0.5;
        } else {
          checked = !obj.$elem.attr('checked');
        }
        
        obj.$elem.attr('checked', checked);

        $[iphoneStyle].currentlyClicking = null;
        $[iphoneStyle].dragging = null;
        obj.$elem.change();
      });
  
    // Animate when we get a change event
    this.$elem.change(function() {
      if (obj.$elem.is(':disabled')) {
        obj.container.addClass(obj.disabledClass);
        return false;
      } else {
        obj.container.removeClass(obj.disabledClass);
      }
      
      var new_left = obj.$elem.attr('checked') ? obj.rightSide : 0;

      obj.handle.animate({         left: new_left },                 obj.duration);
      obj.onLabel.animate({       width: new_left + 4 },             obj.duration);
      obj.offSpan.animate({ marginRight: -new_left },                obj.duration);
      obj.onSpan.animate({   marginLeft: new_left - obj.rightSide }, obj.duration);
    });
  },
  
  // Setup the control's inital position
  initialPosition: function() {
    this.offLabel.css({ width: this.container.width() - 5 });

    var offset = ($.browser.msie && $.browser.version < 7) ? 3 : 6;
    this.rightSide = this.container.width() - this.handle.width() - offset;

    if (this.$elem.is(':checked')) {
      this.handle.css({ left: this.rightSide });
      this.onLabel.css({ width: this.rightSide + 4 });
      this.offSpan.css({ marginRight: -this.rightSide });
    } else {
      this.onLabel.css({ width: 0 });
      this.onSpan.css({ marginLeft: -this.rightSide });
    }
    
    if (this.$elem.is(':disabled')) {
      this.container.addClass(this.disabledClass);
    }
  }
});

// jQuery-specific code
$.fn[iphoneStyle] = function(options) {
  var checkboxes = this.filter(':checkbox');
  
  // Fail early if we don't have any checkboxes passed in
  if (!checkboxes.length) { return this; }
  
  // Merge options passed in with global defaults
  var opt = $.extend({}, $[iphoneStyle].defaults, options);
  
  checkboxes.each(function() {
    $(this).data(iphoneStyle, new $[iphoneStyle](this, opt));
  });

  if (!$[iphoneStyle].initComplete) {
    // As the mouse moves on the page, animate if we are in a drag state
    $(document)
      .bind('mousemove touchmove', function(event) {
        if (!$[iphoneStyle].currentlyClicking) { return; }
        event.preventDefault();
        
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        if (!$[iphoneStyle].dragging &&
            (Math.abs($[iphoneStyle].dragStartPosition - x) > opt.dragThreshold)) { 
          $[iphoneStyle].dragging = true; 
        }
    
        $(event.target).trigger('iPhoneDrag', [x]);
      })

      // When the mouse comes up, leave drag state
      .bind('mouseup touchend', function(event) {        
        if (!$[iphoneStyle].currentlyClicking) { return; }
        event.preventDefault();
    
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        $($[iphoneStyle].currentlyClicking).trigger('iPhoneDragEnd', [x]);
      });
      
    $[iphoneStyle].initComplete = true;
  }
  
  return this;
}; // End of $.fn[iphoneStyle]

$[iphoneStyle].defaults = {
  duration:          200,                       // Time spent during slide animation
  checkedLabel:      'ON',                      // Text content of "on" state
  uncheckedLabel:    'OFF',                     // Text content of "off" state
  resizeHandle:      true,                      // Automatically resize the handle to cover either label
  resizeContainer:   true,                      // Automatically resize the widget to contain the labels
  disabledClass:     'iPhoneCheckDisabled',
  containerClass:    'iPhoneCheckContainer',
  labelOnClass:      'iPhoneCheckLabelOn',
  labelOffClass:     'iPhoneCheckLabelOff',
  handleClass:       'iPhoneCheckHandle',
  handleCenterClass: 'iPhoneCheckHandleCenter',
  handleRightClass:  'iPhoneCheckHandleRight',
  dragThreshold:     5                          // Pixels that must be dragged for a click to be ignored
};

})(jQuery, 'iphoneStyle');


/**
 * ########################################################
 * jVertTabs - JQuery plugin for creating vertical tabs.
 * By Seth Lenzi - slenzi@gmail.com
 * This is free! Do with it as you want!
 * MIT License. - http://en.wikipedia.org/wiki/MIT_License
 * ########################################################
 *
 * Change History:
 *
 * June 30, 2010 - v1.1.4 ---- CSS Updates. IE-8 fixes relating to height, width, & margin settings.
 *
 * March 3, 2010 - v1.1.3 ---- Added code to ensure that all vtabs-content-panel elements are at least as tall as the tabColumn element.
 *							   This is to address issue #1, http://code.google.com/p/jquery-vert-tabs/issues/detail?id=1
 * 
 * February 8, 2010 - v1.1.2 - More bug fixes...sigh. Plugin now keeps track of options for each tab set via the 
 *                             allTabOptions object.
 *
 * February 6, 2010 - v1.1.1 - Bug fix dealing with varying length tabs that go beyond the default CSS width of 150px.
 *						     
 * February 5, 2010 - v1.1 --- Added set selected tab function.
 *						       (e.g. $("#elm").jVertTabs('selected',2); // select 3rd tab, 0-based.)
 *
 * February 3, 2010 - v1.0 --- Initial release.
 *
 *
 * ------------------------------------------------------
 *
 * default options
 *
 * selected: Index of the tab to open on initialization. 0-based, first tab is 0, second tab is 1, etc..
 *
 * select: A callback function that is called when a tab is clicked. The 'index' value will be the index of
 *         the tab that was clicked. 0-based, first tab is 0, second tab is 1, etc..
 *
 * spinner: Text to show during ajax request. Pass in empty string to deactivate that behavior.
 *
 * equalHeights: If set to true the content panels will all have the same height. The min-heigh value
 *               for each panel will be set to that of the tallest panel in the group. By default this
 *               feature is turned off, or "false". Set to "true" to turn on.
 */ 
(function($) {

	// keep track of options for each tab group
	var allTabOptions = new Array();

	/**
	 * String startsWith function. 
	 */
        //we have our own version of this function defined in util.js
//	String.prototype.startsWith = function(str){
//		return (this.match("^"+str)==str);
//	}
	
	$.fn.jVertTabs = function(attr,options) {
	
		var elmId = $(this).attr('id');
	
		var opts;
		var defaults = {
			selected: 0,
			select: function(index){
				//alert("Tab " + index + " clicked.");
			},
			spinner: "Retrieving data...",
			equalHeights: false
		};

		var tabColumnHeight = 0;
	
		// Check to see if an object is a plain object (created using "{}" or "new Object").
		if($.isPlainObject(attr)){
			
			// This block will be executed when we call our plugin with options:
			// $("#elmId").jVertTabsDev({
			// 		selected: 1
			// });
			
			// extend default options with any that were provided by user
			options = attr;
			opts = $.extend(defaults, options);
			allTabOptions[elmId] = opts;
			
		}else{
			
			// This block will be executed when we call our plugin like so:
			// $("#elmId").jVertTabsDev();
			// Or..
			// $("#elmId").jVertTabsDev('active',true);
		
			if(attr != null && options != null){
				if(attr == "selected"){
					//alert("a attr: " + attr + ", options: " + options);
					var thisTabOpts = allTabOptions[elmId];
					//alert(elmId + " before: " + thisTabOpts.selected);
					thisTabOpts.selected = options;
					//alert(elmId + " after: " + thisTabOpts.selected);
					/* add css classes to elements */
					var tabRoot = $(this);
					doSelectTab($(this),options);
					return;
				}
			}else{
			
				//alert("b attr: " + attr + ", options: " + options);
			
				// extend default options with any that were provided by user
				opts = $.extend(defaults, options);
				allTabOptions[elmId] = opts;			
			
			}
		}
		
		// apply jVertTabs to all matching elements
        return this.each(function() {
		
			/* add css classes to elements */
			var tabRoot = $(this);
			setStyle(tabRoot);
		
			/* references to tab column and tab content column */
			var tabColumn = tabRoot.children("div.vtabs-tab-column");
			var tabContentColumn = tabRoot.children("div.vtabs-content-column");
			//tabColumnHeight = tabColumn.height();
			
			/* locate all li elements  */
			$(this).find(".vtabs-tab-column > ul > li").each(function(i){
				
				/* set css for initial state of tabs. first tab is open, the rest are closed.*/
				if(i < 1){
					$(this).addClass("open");
					$(this).find("a").addClass("open");
				}else{
					$(this).addClass("closed");
					$(this).find("a").addClass("closed");
				}
				
				/* add click events to all li elements */
				$(this).click(function() {
					handleTabClick($(this),i,tabRoot,true);
					return false;
				});
			});
			
			/* set initial state of tab content panels. first panel is open, the rest are closed */
			$(this).children(".vtabs-content-column > div.vtabs-content-panel").each(function(i){
				if(i>0){
					$(this).hide();
				}		
			});
			
			/* open specified tab on itialization. this is customizable via the 'selected' option */
			var thisTabOpts = allTabOptions[elmId];
			if(thisTabOpts != null){
				var preSelectLi = tabColumn.find("ul > li").eq(thisTabOpts.selected);
				handleTabClick(preSelectLi,thisTabOpts.selected,tabRoot,false);
			}

			/* equalize heights if user specified to do so */
			var thisTabOpts = allTabOptions[elmId];
			if(thisTabOpts != null && thisTabOpts.equalHeights){
				equalizeHeights(tabContentColumn);
			}

			/* make sure that the content panels are not shorter than the tabColumn element */
			tabColumnHeight = getTotalTabsHeight(tabRoot);
			setMinHeight(tabContentColumn,tabColumnHeight);			
			
			adjustMargin(tabRoot);
			
        });
		
		/**
		 * Selects a tab (opens the tab.)
		 *
		 * tabRoot - Reference to the root tab element.
		 * index - the tab to open, 0-based index. 0 = first tab, 1 = second tab, etc...
		 */
		function doSelectTab(tabRoot,index){
			var tabColumn = tabRoot.children("div.vtabs-tab-column");
			var tabContentColumn = tabRoot.children("div.vtabs-content-column");
			var selectLi = tabColumn.find("ul > li").eq(index);			
			handleTabClick(selectLi,index,tabRoot,true);
		}
		
		/**
		 * Click event handler.
		 *
		 * li 			      - <li></li> element that was clicked
		 * liIndex		 	  - index of the <li></li> element that was clicked. 0-based.
		 * tabRoot 			  - Reference to the root tab element.
		 * doSelectedCallBack - true to call the 'select' callback function, false not to.
		 */
		function handleTabClick(li,liIndex,tabRoot,doSelectedCallBack){

			var elmId = tabRoot.attr('id');
			var tabCol = tabRoot.children("div.vtabs-tab-column");
			var tabContentCol = tabRoot.children("div.vtabs-content-column");
					
			/* set css to closed for ones that are currently open */
			tabCol.find("ul > li").each(function(i){
				if($(this).hasClass("open")){
					$(this).removeClass("open").addClass("closed");
					$(this).find("a").removeClass("open").addClass("closed");
				}
			});
			/* set css for tab that was clicked */ 
			li.removeClass("closed").addClass("open");
			li.find("a").removeClass("closed").addClass("open");		
				
			/* hide all content panels and get reference to panel that needs to be showed. */
			var openContentPanel;
			tabContentCol.children("div.vtabs-content-panel").each(function(i){
				$(this).hide();
				if(i == liIndex){
					openContentPanel = $(this);
				}
			});
			
			/* get link ahref value to see if we need to make an ajax call */
			var link = li.find("a");
			var linkText = link.text();
			var linkValue = link.attr("href");
			if(!linkValue.startsWith("#")){
				// set spinner message on link if we have a spinner value
				if(opts.spinner != ""){
					link.text(opts.spinner);
				}
				// make ajax call to get data
				$.ajax({
					url: linkValue,
					type: "POST",
					//dataType: "html",
					success: function(data) {
						// set data
						openContentPanel.html(data);				
						// open panel
						openContentPanel.fadeIn(1000);				
						// set link text back to what it originally was
						link.text(linkText);
						/* re-equalize heights if user specified to do so */
						var thisTabOpts = allTabOptions[elmId];
						if(thisTabOpts != null && thisTabOpts.equalHeights){
							equalizeHeights(tabContentCol);
						}					
					},
					error: function(request,status,errorThrown) {
						// set link text back to what it originally was
						link.text(linkText);
						// alert error to user
						alert("Error requesting " + linkValue + ": " + errorThrown);
					}
				});
			}else{
				// no ajax request, open the panel
				openContentPanel.fadeIn(1000);
			}
			
			/* see if the user provided an optional callback function to call when a tab is clicked */
			var thisTabOpts = allTabOptions[elmId];
			if(thisTabOpts != null && doSelectedCallBack){
				if(jQuery.isFunction(thisTabOpts.select)){
					thisTabOpts.select.call(this,liIndex);
				}
			}		
			
		};
		
		/**
		 * Loop through all tabs and sum all their heights.
		 */
		function getTotalTabsHeight(tabRoot){
			/* locate all li elements  */
			var height = 0;
			tabRoot.find(".vtabs-tab-column > ul > li").each(function(i){
				//height += parseInt( $(this).css("height").replace("px","") );
				height += $(this).outerHeight(true);
			});
			return height;
		}		
		
		/**
		 * Sets the height (min-height) of all content panels to that of the tallest one.
		 *
		 * tabContentCol - reference to the #vtabs-content-column element
		 */
		function equalizeHeights(tabContentCol){
			var tallest = getTallestHeight(tabContentCol);
			//alert("Equalize heights to: " + tallest);
			setMinHeight(tabContentCol,tallest);
		};
		
		/**
		 * Iterates through all content panels and gets the height of the tallest one.
		 *
		 * tabContentCol - reference to the #vtabs-content-column element
		 */
		function getTallestHeight(tabContentCol){
			var maxHeight = 0, currentHeight = 0;
			tabContentCol.children("div.vtabs-content-panel").each(function(i){
				//currentHeight = parseInt( $(this).css("height").replace("px","") );
				currentHeight = $(this).height();
				if(currentHeight > maxHeight){
					maxHeight = currentHeight;
				}
			});
			return maxHeight;
		};
		
		/**
		 * Iterates through all content panels and sets the min-height value for each one.
		 *
		 * tabContentCol - reference to the #vtabs-content-column element
		 * minHeight - the min-height value
		 */
		function setMinHeight(tabContentCol,minHeight){
			var panelHeight = 0;
			tabContentCol.children("div.vtabs-content-panel").each(function(i){
				panelHeight = $(this).height();
				if(panelHeight < minHeight){
					$(this).css("min-height",minHeight);
					//$(this).css("height",minHeight);
					// set height if IE
					if ($.browser.msie) {
						//$(this).css("height",minHeight);
					}
				}
			});
		};
		
		/**
		 * Adds the tab css classes to all the elements.
		 *
		 * tabRoot - reference to the root tab element.
		 */
		function setStyle(tabRoot){
			tabRoot.addClass("vtabs");
			tabRoot.children("div").eq(0).addClass("vtabs-tab-column");
			tabRoot.children("div").eq(1).addClass("vtabs-content-column");
			tabRoot.children("div").eq(1).children("div").addClass("vtabs-content-panel");
		};

		/**
		 * Adjusts the left margin of the content column so it lines up with the edges of the tabs.
		 *
		 * tabRoot - reference to the root tab element.
		 */		
		function adjustMargin(tabRoot){			
			var tabColumn = tabRoot.children("div.vtabs-tab-column");
			var tabColWidth = tabColumn.width();
			$(tabRoot).children('div.vtabs-content-column').css({"margin-left": tabColWidth-1 + "px"});
			//alert("Client Width of tabColumn: " + $(tabColumn).get(0).clientWidth);	 // convert jquery object to DOM element using get(0) call.	
		}

	};
		
})(jQuery);

$(function(){
    
    //TODO: init draggable for touch UI
    
    
    //$('#util_keyboard_container').draggable({handle: "#util_keyboard_container #drag_handle"});
    
    
    var $write = $('#write'),
    shift = false,
    capslock = false;
	
    $('#util_keyboard li').click(function(){
        var $this = $(this),
        character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
		
        // Shift keys
        if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();
			
            shift = (shift === true) ? false : true;
            capslock = false;
            return false;
        }
		
        // Caps lock
        if ($this.hasClass('capslock')) {
            $('.letter').toggleClass('uppercase');
            capslock = true;
            return false;
        }
		
        // Delete
        if ($this.hasClass('delete')) {
            var html = $write.html();
			
            //$write.html(html.substr(0, html.length - 1));
            doDeleteCharLastActiveInput();
            return false;
        }
		
        // Special characters
        if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
        if ($this.hasClass('space')) character = ' ';
        
        //tab
        if ($this.hasClass('tab')) {
            //character = "\t";
            doTabLastActiveInput();
            return false;
        }
        
        if ($this.hasClass('return')) character = "\n";
		
        // Uppercase letter
        if ($this.hasClass('uppercase')) character = character.toUpperCase();
		
        // Remove shift once a key is clicked.
        if (shift === true) {
            $('.symbol span').toggle();
            if (capslock === false) $('.letter').toggleClass('uppercase');
			
            shift = false;
        }
		
        // Add the character
        //$write.html($write.html() + character);
        doWriteToLastActiveInput(character);
    });
});

(function($) {
	
	// Define default scroll settings
	var defaults = {
		y: 0,
		elastic: true,
		momentum: true,
		elasticDamp: 0.6,
		elasticTime: 50,
		reboundTime: 400,
		momentumDamp: 0.9,
		momentumTime: 300,
		iPadMomentumDamp: 0.95,
		iPadMomentumTime: 1200
	};
	
	// Define methods
	var methods = {
		
		init: function(options) {
			return this.each(function() {
				
				// Define element variables
				var $this = $(this),
					o = $.extend(defaults, options),
					scrollY = -o.y,
					touchY = 0,
					movedY = 0,
					pollY = 0,
					height = 0,
					maxHeight = 0,
					scrollHeight = $this.attr('scrollHeight'),
					scrolling = false,
					bouncing = false,
					moved = false,
					timeoutID,
					isiPad = navigator.platform.indexOf('iPad') !== -1,
					hasMatrix = 'WebKitCSSMatrix' in window,
					has3d = hasMatrix && 'm11' in new WebKitCSSMatrix();
				
				// Keep bottom of scroll area at the bottom on resize
				var update = this.update = function() {
					height = $this.height();
					scrollHeight = $this.attr('scrollHeight');
					maxHeight = height - scrollHeight;
					clearTimeout(timeoutID);
					clampScroll(false);
				};
				
				// Set up initial variables
				update();
				
				// Set up transform CSS
				$this.css({'-webkit-transition-property': '-webkit-transform',
					'-webkit-transition-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
					'-webkit-transition-duration': '0',
					'-webkit-transform': cssTranslate(scrollY)});
				
				// Listen for screen size change event
				window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', update, false);
				
				// Listen for touch events
				$this.bind('touchstart.touchScroll', touchStart);
				$this.bind('touchmove.touchScroll', touchMove);
				$this.bind('touchend.touchScroll touchcancel.touchScroll', touchEnd);
				$this.bind('webkitTransitionEnd.touchScroll', transitionEnd);
				
				// Set the position of the scroll area using transform CSS
				var setPosition = this.setPosition = function(y) {
					scrollY = y;
					$this.css('-webkit-transform', cssTranslate(scrollY));
				};
				
				// Transform using a 3D translate if available
				function cssTranslate(y) {
					return 'translate' + (has3d ? '3d(0px, ' : '(0px, ') + y + 'px' + (has3d ? ', 0px)' : ')');
				}
				
				// Set CSS transition time
				function setTransitionTime(time) {
					time = time || '0';
					$this.css('-webkit-transition-duration', time + 'ms');
				}

				// Get the actual pixel position made by transform CSS
				function getPosition() {
					if (hasMatrix) {
						var matrix = new WebKitCSSMatrix(window.getComputedStyle($this[0]).webkitTransform);
						return matrix.f;
					}
					return scrollY;
				}
				
				this.getPosition = function() {
					return getPosition();
				};

				// Bounce back to the bounds after momentum scrolling
				function reboundScroll() {
					if (scrollY > 0) {
						scrollTo(0, o.reboundTime);
					} else if (scrollY < maxHeight) {
						scrollTo(maxHeight, o.reboundTime);
					}
				}

				// Stop everything once the CSS transition in complete
				function transitionEnd() {
					if (bouncing) {
						bouncing = false;
						reboundScroll();
					}

					clearTimeout(timeoutID);
				}
				
				// Limit the scrolling to within the bounds
				function clampScroll(poll) {
					if (!hasMatrix || bouncing) {
						return;
					}

					var oldY = pollY;
					pollY = getPosition();
					
					if (pollY > 0) {
						if (o.elastic) {
							// Slow down outside top bound
							bouncing = true;
							scrollY = 0;
							momentumScroll(pollY - oldY, o.elasticDamp, 1, height, o.elasticTime);
						} else {
							// Stop outside top bound
							setTransitionTime(0);
							setPosition(0);
						}
					} else if (pollY < maxHeight) {
						if (o.elastic) {
							// Slow down outside bottom bound
							bouncing = true;
							scrollY = maxHeight;
							momentumScroll(pollY - oldY, o.elasticDamp, 1, height, o.elasticTime);
						} else {
							// Stop outside bottom bound
							setTransitionTime(0);
							setPosition(maxHeight);
						}
					} else if (poll) {
						// Poll the computed position to check if element is out of bounds
						timeoutID = setTimeout(clampScroll, 20, true);
					}
				}
				
				// Animate to a position using CSS
				function scrollTo(destY, time) {
					if (destY === scrollY) {
						return;
					}

					moved = true;
					setTransitionTime(time);
					setPosition(destY);
				}
				
				// Perform a momentum-based scroll using CSS
				function momentumScroll(d, k, minDist, maxDist, t) {
					var ad = Math.abs(d),
						dy = 0;
					
					// Calculate the total distance
					while (ad > 0.1) {
						ad *= k;
						dy += ad;
					}
					
					// Limit to within min and max distances
					if (dy > maxDist) {
						dy = maxDist;
					}
					if (dy > minDist) {
						if (d < 0) {
							dy = -dy;
						}
						
						// Perform scroll
						scrollTo(scrollY + Math.round(dy), t);
					}
					
					clampScroll(true);
				}
				
				// Get the touch points from this event
				function getTouches(e) {
					if (e.originalEvent) {
						if (e.originalEvent.touches && e.originalEvent.touches.length) {
							return e.originalEvent.touches;
						} else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
							return e.originalEvent.changedTouches;
						}
					}
					return e.touches;
				}
				
				// Perform a touch start event
				function touchStart(e) {
					e.preventDefault();
					e.stopPropagation();
					
					var touches = getTouches(e);
					
					scrolling = true;
					moved = false;
					movedY = 0;
					
					clearTimeout(timeoutID);
					setTransitionTime(0);
					
					// Check scroll position
					if (o.momentum) {
						var y = getPosition();
						if (y !== scrollY) {
							setPosition(y);
							moved = true;
						}
					}

					touchY = touches[0].pageY - scrollY;
				}
				
				// Perform a touch move event
				function touchMove(e) {
					if (!scrolling) {
						return;
					}
					
					var touches = getTouches(e),
						dy = touches[0].pageY - touchY;
					
					// Elastic-drag or stop when moving outside of boundaries
					if (dy > 0) {
						if (o.elastic) {
							dy /= 2;
						} else {
							dy = 0;
						}
					} else if (dy < maxHeight) {
						if (o.elastic) {
							dy = (dy + maxHeight) / 2;
						} else {
							dy = maxHeight;
						}
					}
					
					movedY = dy - scrollY;
					moved = true;
					setPosition(dy);
				}
				
				// Perform a touch end event
				function touchEnd(e) {
					if (!scrolling) {
						return;
					}
					
					scrolling = false;
					
					var touches = getTouches(e);
					
					if (moved) {
						// Ease back to within boundaries
						if (scrollY > 0 || scrollY < maxHeight) {
							reboundScroll();
						} else if (o.momentum) {
							// Free scroll with momentum
							momentumScroll(movedY, isiPad ? o.iPadMomentumDamp : o.momentumDamp, 40, 2000, isiPad ? o.iPadMomentumTime : o.momentumTime);
						}			
					} else {
						// Dispatch a fake click event if this touch event did not move
						var touch = touches[0],
							target = touch.target,
							me = document.createEvent('MouseEvent');

						while (target.nodeType !== 1) {
							target = target.parentNode;
						}
						me.initMouseEvent('click', true, true, touch.view, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
						target.dispatchEvent(me);
					}
				}
			
			});
		},
		
		update: function() {
			return this.each(function() {
				this.update();
			});
		},
		
		getPosition: function() {
			var a = [];
			this.each(function() {
				a.push(-this.getPosition());
			});
			return a;
		},
		
		setPosition: function(y) {
			return this.each(function() {
				this.setPosition(-y);
			});
		}
		
	};
	
	// Public method for touchScroll
	$.fn.touchScroll = function(method) {
	    if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.touchScroll');
		}
	};

})(jQuery);

/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (key, value, options) {
    
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        
        value = String(value);
        
        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


/**
 * JSON Cookie - jquery.jsoncookie.js
 *
 * Sets and retreives native JavaScript objects as cookies.
 * Depends on the object serialization framework provided by JSON2.
 *
 * Dependencies: jQuery, jQuery Cookie, JSON2
 *
 * @project JSON Cookie
 * @author Randall Morey
 * @version 0.9
 */
(function ($) {
	var isObject = function (x) {
		return (typeof x === 'object') && !(x instanceof Array) && (x !== null);
	};

	$.extend({
		getJSONCookie: function (cookieName) {
			var cookieData = $.cookie(cookieName);
			return cookieData ? JSON.parse(cookieData) : null;
		},
		setJSONCookie: function (cookieName, data, options) {
			var cookieData = '';

			options = $.extend({
				expires: 90,
				path: '/'
			}, options);

			if (!isObject(data)) {	// data must be a true object to be serialized
				throw new Error('JSONCookie data must be an object');
			}

			cookieData = JSON.stringify(data);

			return $.cookie(cookieName, cookieData, options);
		},
		removeJSONCookie: function (cookieName) {
			return $.cookie(cookieName, null);
		},
		JSONCookie: function (cookieName, data, options) {
			if (data) {
				$.setJSONCookie(cookieName, data, options);
			}
			return $.getJSONCookie(cookieName);
		}
	});
})(jQuery);



/* Sets time in clock div and calls itself every second */
/**
* Clock plugin
* Copyright (c) 2010 John R D'Orazio (donjohn.fmmi@gmail.com)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Turns a jQuery dom element into a dynamic clock
*
* @timestamp defaults to clients current time
* $("#mydiv").clock();
* >> will turn div into clock using client computer's current time
* @timestamp server-side example:
* Say we have a hidden input with id='timestmp' the value of which is determined server-side with server's current time
* $("#mydiv").clock({"timestamp":$("#timestmp").val()});
* >> will turn div into clock passing in server's current time as retrieved from hidden input
*
* @format defaults to 12 hour format,
* or if langSet is indicated defaults to most appropriate format for that langSet
* $("#mydiv").clock(); >> will have 12 hour format
* $("#mydiv").clock({"langSet":"it"}); >> will have 24 hour format
* $("#mydiv").clock({"langSet":"en"}); >> will have 12 hour format
* $("#mydiv").clock({"langSet":"en","format":"24"}); >> will have military style 24 hour format
* $("#mydiv").clock({"calendar":true}); >> will include the date with the time, and will update the date at midnight
*
*/

(function($, undefined) {

$.clock = { version: "2.0.1", locale: {} }

t = new Array();
  
$.fn.clock = function(options) {
  var locale = {
    "it":{
      "weekdays":["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"],
      "months":["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]
    },
    "en":{
      "weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "months":["January","February","March","April","May","June","July","August","September","October","November","December"]
    },
    "es":{
      "weekdays":["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      "months":["Enero", "Febrero", "Marzo", "Abril", "May", "junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    "de":{
      "weekdays":["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      "months":["Januar", "Februar", "März", "April", "könnte", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    },
    "fr":{
      "weekdays":["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      "months":["Janvier", "Février", "Mars", "Avril", "May", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    },
    "ru":{
      "weekdays":["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      "months":["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    }
  }

  return this.each(function(){
    $.extend(locale,$.clock.locale);
    options = options || {};
    options.timestamp = options.timestamp || "systime";
    systimestamp = new Date();
    systimestamp = systimestamp.getTime();
    options.sysdiff = 0;
    if(options.timestamp!="systime"){
      mytimestamp = new Date(options.timestamp);
      options.sysdiff = options.timestamp - systimestamp;
    }
    options.langSet = options.langSet || "en";
    options.format = options.format || ((options.langSet!="en") ? "24" : "12");
    options.calendar = options.calendar || "true";

    if (!$(this).hasClass("jqclock")){$(this).addClass("jqclock");}

    var addleadingzero = function(i){
      if (i<10){i="0" + i;}
      return i;
    },
    updateClock = function(el,myoptions) {
      var el_id = $(el).attr("id");
      if(myoptions=="destroy"){ clearTimeout(t[el_id]); }
      else {
        mytimestamp = new Date();
        mytimestamp = mytimestamp.getTime();
        mytimestamp = mytimestamp + myoptions.sysdiff;
        mytimestamp = new Date(mytimestamp);
        var h=mytimestamp.getHours(),
        m=mytimestamp.getMinutes(),
        s=mytimestamp.getSeconds(),
        dy=mytimestamp.getDay(),
        dt=mytimestamp.getDate(),
        mo=mytimestamp.getMonth(),
        y=mytimestamp.getFullYear(),
        ap="",
        calend="";

        if(myoptions.format=="12"){
          ap=" AM";
          if (h > 11) { ap = " PM"; }
          if (h > 12) { h = h - 12; }
          if (h == 0) { h = 12; }
        }

        // add a zero in front of numbers 0-9
        h=addleadingzero(h);
        m=addleadingzero(m);
        s= ":" + addleadingzero(s);
        
        //Lee added this:::
        //don't show seconds anymore'
        s = "";

        if(myoptions.calendar!="false") {
          if (myoptions.langSet=="en") {
            calend = "<span class='clockdate'>"+locale[myoptions.langSet].weekdays[dy]+', '+locale[myoptions.langSet].months[mo]+' '+dt+', '+y+"</span>";
          }
          else {
            calend = "<span class='clockdate'>"+locale[myoptions.langSet].weekdays[dy]+', '+dt+' '+locale[myoptions.langSet].months[mo]+' '+y+"</span>";
          }
        }
        $(el).html(calend+"<span class='clocktime'>"+h+":"+m+s+ap+"</span>");
        t[el_id] = setTimeout(function() { updateClock( $(el),myoptions ) }, 1000);
      }

    }
      
    updateClock($(this),options);
  });
}

  return this;

})(jQuery);

// 
/*!
 * jquery.plugin.menuTree.js v0.8
 * Copyright 2010, Bill Heaton http://pixelhandler.com
 *
 * Requires jquery version 1.4
 * http://jquery.com/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://docs.jquery.com/License
 *
 * Sat May 8 1:42 GMT-8:00
 */

(function($) {
    $.fn.menuTree = function(options) {
        // extend default options with aruments on function call
        var opts = $.extend({}, $.fn.menuTree.defaults, options);
		
        // default options
        $.fn.menuTree.defaults = { 
            // setup animation
            animation: false, 
            handler: 'css',
            speed: 'fast',
            // setup hooks in markup
            listElement: 'ul',
            anchor: 'a[href^="#"]'
        };
		
        // tree behavior only operates on anchor elements in the list that begin with a hash '#' unless options called for
        $.fn.menuTree.mtParent = $(this);
        $.fn.menuTree.mtTargets = $.fn.menuTree.mtParent.find(opts.anchor);
        function reveal(element) {
            var $reveal = $(element);
            // select targets to reveal based on options we choose what list element to target default is 'ul'
            switch(opts.listElement) {
                case "dd":
                    $reveal.mtReveal = $reveal.parent().next(opts.listElement);
                    break;
                case "ol":
                    $reveal.mtReveal = $reveal.next(opts.listElement);
                    break;
                default:
                    $reveal.mtReveal = $reveal.next(opts.listElement);
            }
            return $reveal.mtReveal; 
        }
		
        // do the magic with the click event ...
        function clickHandler(event) {
            var $target = $(event.target).closest('a','li');
            if ( 0 === $target.size() ) { 
                $target = $(event.target); 
            }
            // if data value is not ready bail out
            if (!$target.data('responsive')){
                return;
            }
            event.preventDefault();
            $target.stop();
			
            // choose your animation behavior based on options passed to plugin instance
            if (!opts.animation) { 
                // false uses CSS to handle effects
                reveal($target).toggleClass('collapsed');
                $target.toggleClass('expanded').data('state','ready').trigger('statechange');
            } else { 
                // true uses opts.handler to choose effects
                $target.data('state','transition').trigger('statechange');

                switch(opts.handler) {
                    case "slideToggle":
                        reveal($target).slideToggle( opts.speed, function() {
                            $(this).prev('.menuTree').toggleClass('expanded').blur().data('state','ready').trigger('statechange');
                        }).toggleClass('collapsed');
                        break;
                    case "toggle":
                        reveal($target).toggle(opts.speed, function() {
                            $(this).prev('.menuTree').toggleClass('expanded').data('state','ready').trigger('statechange');
                        }).toggleClass('collapsed');
                        break;
                    default: 
                // css only, but if called with true we should do something
                }
            }
                        
            //call the callback function after the click event
            if(opts.callback) {
                opts.callback();
            }
        }
		
        // set up listener controller function
        // used to prevent multiple clicks, click event is disabled during animation
        $.fn.menuTree.controller = function(event) {
            var $target = $(event.target);
            // manage link state
            if ($target.data('state') != 'ready'){
                $target.data('responsive',false);
            } else {
                $target.data('responsive',true);
                // may need to collapse children
                if ($target.next(opts.listElement).find('.expanded').length > 0) {
                    $target.next(opts.listElement).find('.expanded').each(function() {
                        $(this).removeClass('expanded').next(opts.listElement).hide().addClass('collapsed');
                    });
                }
            }
        };
		
        // setup tree behavior and bind on controller
        $.fn.menuTree.init = (function() {
			
            $.fn.menuTree.mtTargets.each(function() {
			
                var $localTarget = $(this);
                $localTarget.data({
                    state: 'ready',
                    responsive: true
                });
                // set behavior up on all .menuTree anchors create with plugin
                $localTarget.addClass('menuTree');
			
                // hide the child elements to reveal later // $.fn.menuTree.
                reveal($localTarget).toggleClass('collapsed');
			
                // set Click event handler for targets
                //$localTarget.click(clickHandler); // no event delegation
                $.fn.menuTree.mtParent.click(clickHandler);
			
                // bind the Controller to listen for state change on
                //$localTarget.bind('statechange',$.fn.menuTree.controller); // no event delegation
                $.fn.menuTree.mtParent.bind('statechange',$.fn.menuTree.controller);
				
            });
        });

        return $.fn.menuTree.init();

    };
})(jQuery);

// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

//see http://www.mattkruse.com/javascript/date/index.html for examples

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x){return(x<0||x>9?"":"0")+x}
function isDate(val,format){var date=getDateFromFormat(val,format);if(date==0){return false;}return true;}
function compareDates(date1,dateformat1,date2,dateformat2){var d1=getDateFromFormat(date1,dateformat1);var d2=getDateFromFormat(date2,dateformat2);if(d1==0 || d2==0){return -1;}else if(d1 > d2){return 1;}return 0;}
function formatDate(date,format){format=format+"";var result="";var i_format=0;var c="";var token="";var y=date.getYear()+"";var M=date.getMonth()+1;var d=date.getDate();var E=date.getDay();var H=date.getHours();var m=date.getMinutes();var s=date.getSeconds();var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;var value=new Object();if(y.length < 4){y=""+(y-0+1900);}value["y"]=""+y;value["yyyy"]=y;value["yy"]=y.substring(2,4);value["M"]=M;value["MM"]=LZ(M);value["MMM"]=MONTH_NAMES[M-1];value["NNN"]=MONTH_NAMES[M+11];value["d"]=d;value["dd"]=LZ(d);value["E"]=DAY_NAMES[E+7];value["EE"]=DAY_NAMES[E];value["H"]=H;value["HH"]=LZ(H);if(H==0){value["h"]=12;}else if(H>12){value["h"]=H-12;}else{value["h"]=H;}value["hh"]=LZ(value["h"]);if(H>11){value["K"]=H-12;}else{value["K"]=H;}value["k"]=H+1;value["KK"]=LZ(value["K"]);value["kk"]=LZ(value["k"]);if(H > 11){value["a"]="PM";}else{value["a"]="AM";}value["m"]=m;value["mm"]=LZ(m);value["s"]=s;value["ss"]=LZ(s);while(i_format < format.length){c=format.charAt(i_format);token="";while((format.charAt(i_format)==c) &&(i_format < format.length)){token += format.charAt(i_format++);}if(value[token] != null){result=result + value[token];}else{result=result + token;}}return result;}
function _isInteger(val){var digits="1234567890";for(var i=0;i < val.length;i++){if(digits.indexOf(val.charAt(i))==-1){return false;}}return true;}
function _getInt(str,i,minlength,maxlength){for(var x=maxlength;x>=minlength;x--){var token=str.substring(i,i+x);if(token.length < minlength){return null;}if(_isInteger(token)){return token;}}return null;}
function getDateFromFormat(val,format){val=val+"";format=format+"";var i_val=0;var i_format=0;var c="";var token="";var token2="";var x,y;var now=new Date();var year=now.getYear();var month=now.getMonth()+1;var date=1;var hh=now.getHours();var mm=now.getMinutes();var ss=now.getSeconds();var ampm="";while(i_format < format.length){c=format.charAt(i_format);token="";while((format.charAt(i_format)==c) &&(i_format < format.length)){token += format.charAt(i_format++);}if(token=="yyyy" || token=="yy" || token=="y"){if(token=="yyyy"){x=4;y=4;}if(token=="yy"){x=2;y=2;}if(token=="y"){x=2;y=4;}year=_getInt(val,i_val,x,y);if(year==null){return 0;}i_val += year.length;if(year.length==2){if(year > 70){year=1900+(year-0);}else{year=2000+(year-0);}}}else if(token=="MMM"||token=="NNN"){month=0;for(var i=0;i<MONTH_NAMES.length;i++){var month_name=MONTH_NAMES[i];if(val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()){if(token=="MMM"||(token=="NNN"&&i>11)){month=i+1;if(month>12){month -= 12;}i_val += month_name.length;break;}}}if((month < 1)||(month>12)){return 0;}}else if(token=="EE"||token=="E"){for(var i=0;i<DAY_NAMES.length;i++){var day_name=DAY_NAMES[i];if(val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()){i_val += day_name.length;break;}}}else if(token=="MM"||token=="M"){month=_getInt(val,i_val,token.length,2);if(month==null||(month<1)||(month>12)){return 0;}i_val+=month.length;}else if(token=="dd"||token=="d"){date=_getInt(val,i_val,token.length,2);if(date==null||(date<1)||(date>31)){return 0;}i_val+=date.length;}else if(token=="hh"||token=="h"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<1)||(hh>12)){return 0;}i_val+=hh.length;}else if(token=="HH"||token=="H"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<0)||(hh>23)){return 0;}i_val+=hh.length;}else if(token=="KK"||token=="K"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<0)||(hh>11)){return 0;}i_val+=hh.length;}else if(token=="kk"||token=="k"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<1)||(hh>24)){return 0;}i_val+=hh.length;hh--;}else if(token=="mm"||token=="m"){mm=_getInt(val,i_val,token.length,2);if(mm==null||(mm<0)||(mm>59)){return 0;}i_val+=mm.length;}else if(token=="ss"||token=="s"){ss=_getInt(val,i_val,token.length,2);if(ss==null||(ss<0)||(ss>59)){return 0;}i_val+=ss.length;}else if(token=="a"){if(val.substring(i_val,i_val+2).toLowerCase()=="am"){ampm="AM";}else if(val.substring(i_val,i_val+2).toLowerCase()=="pm"){ampm="PM";}else{return 0;}i_val+=2;}else{if(val.substring(i_val,i_val+token.length)!=token){return 0;}else{i_val+=token.length;}}}if(i_val != val.length){return 0;}if(month==2){if( ((year%4==0)&&(year%100 != 0) ) ||(year%400==0) ){if(date > 29){return 0;}}else{if(date > 28){return 0;}}}if((month==4)||(month==6)||(month==9)||(month==11)){if(date > 30){return 0;}}if(hh<12 && ampm=="PM"){hh=hh-0+12;}else if(hh>11 && ampm=="AM"){hh-=12;}var newdate=new Date(year,month-1,date,hh,mm,ss);return newdate.getTime();}
function parseDate(val){var preferEuro=(arguments.length==2)?arguments[1]:false;generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');var d=null;for(var i=0;i<checkList.length;i++){var l=window[checkList[i]];for(var j=0;j<l.length;j++){d=getDateFromFormat(val,l[j]);if(d!=0){return new Date(d);}}}return null;}



// webkitdragdrop.js v1.0, Mon May 15 2010
//
// Copyright (c) 2010 Tommaso Buvoli (http://www.tommasobuvoli.com)
// No Extra Libraries are required, simply download this file, add it to your pages!
//
// To See this library in action, grab an ipad and head over to http://www.gotproject.com
// webkitdragdrop is freely distributable under the terms of an MIT-style license.


//Description
// Because this library was designed to run without requiring any other libraries, several basic helper functions were implemented
// 6 helper functons in this webkit_tools class have been taked directly from Prototype 1.6.1 (http://prototypejs.org/) (c) 2005-2009 Sam Stephenson

var webkit_tools = 
{
	//$ function - simply a more robust getElementById
		
	$:function(e)
	{
		if(typeof(e) == 'string')
		{
			return document.getElementById(e);
		}
		return e;
	},
	
	//extend function - copies the values of b into a (Shallow copy)
	
	extend:function(a,b)
	{
		for (var key in b)
		{
			a[key] = b[key];	
		}	
		return a;
	},
	
	//empty function - used as defaut for events
	
	empty:function()
	{
	
	},
	
	//remove null values from an array
	
	compact:function(a)
	{
		var b = []
		var l = a.length;
		for(var i = 0; i < l; i ++)
		{
			if(a[i] !== null)
			{
				b.push(a[i]);
			}
		}
		return b;
	},
	
	//DESCRIPTION
	//	This function was taken from the internet (http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/) and returns 
	//	the computed style of an element independantly from the browser
	//INPUT
	//	oELM (DOM ELEMENT) element whose style should be extracted
	//	strCssRule element
	
	getCalculatedStyle:function(oElm, strCssRule)
	{
		var strValue = "";
		if(document.defaultView && document.defaultView.getComputedStyle){
			strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
		}
		else if(oElm.currentStyle){
			strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
				return p1.toUpperCase();
			});
			strValue = oElm.currentStyle[strCssRule];
		}
		return strValue;
	},
	
	//bindAsEventListener function - used to bind events
	
	bindAsEventListener:function(f,object) 
	{
        var __method = f;
        return function(event) {
            __method.call(object, event || window.event);
        };
    },
    
    //cumulative offset - courtesy of Prototype (http://www.prototypejs.org)
    
    cumulativeOffset:function(element) 
    {
	    var valueT = 0, valueL = 0;
	    do {
	      valueT += element.offsetTop  || 0;
	      valueL += element.offsetLeft || 0;
	      if (element.offsetParent == document.body)
	        if (element.style.position == 'absolute') break;
	
	      element = element.offsetParent;
	    } while (element);
	
	    return {left : valueL, top : valueT};
  	},
  	
  	//getDimensions - courtesy of Prototype (http://www.prototypejs.org)
  	
	getDimensions: function(element) 
	{
	    var display = element.style.display;
	    if (display != 'none' && display != null) // Safari bug
	      return {width: element.offsetWidth, height: element.offsetHeight};
	
	    var els = element.style;
	    var originalVisibility = els.visibility;
	    var originalPosition = els.position;
	    var originalDisplay = els.display;
	    els.visibility = 'hidden';
	    if (originalPosition != 'fixed') // Switching fixed to absolute causes issues in Safari
	      els.position = 'absolute';
	    els.display = 'block';
	    var originalWidth = element.clientWidth;
	    var originalHeight = element.clientHeight;
	    els.display = originalDisplay;
	    els.position = originalPosition;
	    els.visibility = originalVisibility;
	    return {width: originalWidth, height: originalHeight};
	},
	
	//hasClassName - courtesy of Prototype (http://www.prototypejs.org)
	
	hasClassName: function(element, className) 
	{
		var elementClassName = element.className;
		return (elementClassName.length > 0 && (elementClassName == className ||
		new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  	},

	//addClassName - courtesy of Prototype (http://www.prototypejs.org)
	
	addClassName: function(element, className) 
	{
		if (!this.hasClassName(element, className))
			element.className += (element.className ? ' ' : '') + className;
		return element;
	},

	//removeClassName - courtesy of Prototype (http://www.prototypejs.org)
	
	removeClassName: function(element, className) 
	{
		element.className = this.strip(element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' '));
		return element;
	},
	
	//strip - courtesy of Prototype (http://www.prototypejs.org)
	
	strip:function(s)
	{
    	return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

}

//Description
// Droppable fire events when a draggable is dropped on them

var webkit_droppables = function()
{
	this.initialize = function()
	{
		this.droppables = [];
		this.droppableRegions = [];
	}
	
	this.add = function(root, instance_props)
	{
		root = webkit_tools.$(root);
		var default_props = {accept : [], hoverClass : null, onDrop : webkit_tools.empty, onOver : webkit_tools.empty, onOut : webkit_tools.empty};
		default_props = webkit_tools.extend(default_props, instance_props || {});
		this.droppables.push({r : root, p : default_props}); 		
	}
	
	this.remove = function(root)
	{
		root = webkit_tools.$(root);
		var d = this.droppables;
		var i = d.length;
		while(i--)
		{
			if(d[i].r == root)
			{
				d[i] = null;
				this.droppables = webkit_tools.compact(d);
				return true;
			}
		}
		return false;
	}
	
	//calculate position and size of all droppables
	
	this.prepare = function()
	{
		var d = this.droppables;
		var i = d.length;
		var dR = [];
		var r = null;
		
		while(i--)
		{
			r = d[i].r;			
			if(r.style.display != 'none')
			{
				dR.push({i : i, size : webkit_tools.getDimensions(r), offset : webkit_tools.cumulativeOffset(r)})			
			}
		}
		
		this.droppableRegions = dR;
	}
	
	this.finalize = function(x,y,r,e)
	{
		var indices = this.isOver(x,y);
		var index = this.maxZIndex(indices);
		var over = this.process(index,r);
		if(over)
		{
			this.drop(index, r,e);
		}
		this.process(-1,r);
		return over;	
	}
	
	this.check = function(x,y,r)
	{
		var indices = this.isOver(x,y);
		var index = this.maxZIndex(indices);
		return this.process(index,r);		
	}
	
	this.isOver = function(x, y)
	{
		var dR = this.droppableRegions;
		var i = dR.length;
		var active = [];
		var r = 0;
		var maxX = 0;
		var minX = 0;
		var maxY = 0;
		var minY = 0;
		
		while(i--)
		{
			r = dR[i];
			
			minY = r.offset.top;
			maxY = minY + r.size.height;
			
			if((y > minY) && (y < maxY))
			{
				minX = r.offset.left;
				maxX = minX + r.size.width;
				
				if((x > minX) && (x < maxX))
				{
					active.push(r.i);
				}			
			}		
		}
		
		return active;	
	}
	
	this.maxZIndex = function(indices)
	{
		var d = this.droppables;
		var l = indices.length;
		var index = -1;
		
		var maxZ = -100000000;
		var curZ = 0;
		
		while(l--)
		{
			curZ = parseInt(d[indices[l]].r.style.zIndex || 0);
			if(curZ > maxZ)
			{
				maxZ = curZ;
				index = indices[l];		
			}	
		}
		
		return index;	
	}
	
	this.process = function(index, draggableRoot)
	{
		//only perform update if a change has occured
		if(this.lastIndex != index)
		{
			//remove previous
			if(this.lastIndex != null)
			{
				var d = this.droppables[this.lastIndex]
				var p = d.p;
				var r = d.r;
				
				if(p.hoverClass)
				{
					webkit_tools.removeClassName(r,p.hoverClass);
				}
				p.onOut();
				this.lastIndex = null;
				this.lastOutput = false;
			}
			
			//add new
			if(index != -1)
			{
				var d = this.droppables[index]
				var p = d.p;
				var r = d.r;
				
				if(this.hasClassNames(draggableRoot, p.accept))
				{
					if(p.hoverClass)
					{
						webkit_tools.addClassName(r,p.hoverClass);
					}
					p.onOver();				
					this.lastIndex = index;
					this.lastOutput = true;	
				}
			}	
		}
		return this.lastOutput;
	}
	
	this.drop = function(index, r, e)
	{
		if(index != -1)
		{
			this.droppables[index].p.onDrop(r,e, this.droppables[index]);
		}
	}
	
	this.hasClassNames = function(r, names)
	{
		var l = names.length;
		if(l == 0){return true}
		while(l--)
		{
			if(webkit_tools.hasClassName(r,names[l]))
			{
				return true;
			}
		}
		return false;
	}
	
	this.initialize();
}

webkit_drop = new webkit_droppables();

//Description
//webkit draggable - allows users to drag elements with their hands

var webkit_draggable = function(r, ip)
{
	this.initialize = function(root, instance_props)
	{
		this.root = webkit_tools.$(root);
		var default_props = {scroll : false, revert : 'always', handle : this.root, zIndex : 1000, onStart : webkit_tools.empty, onEnd : webkit_tools.empty};
		
		this.p = webkit_tools.extend(default_props, instance_props || {});
		default_props.handle = webkit_tools.$(default_props.handle);
		this.prepare();
		this.bindEvents();
	}
	
	this.prepare = function()
	{
		var rs = this.root.style;
		
		//set position
		if(webkit_tools.getCalculatedStyle(this.root,'position') != 'absolute')
		{
			rs.position = 'relative';
		}
		
		//set top, right, bottom, left
		rs.top = rs.top || '0px';
		rs.left = rs.left || '0px';
		rs.right = "";
		rs.bottom = "";		
		
		//set zindex;
		rs.zIndex = rs.zIndex || '0';
	}
	
	this.bindEvents = function()
	{
		var handle = this.p.handle;
		
		this.ts = webkit_tools.bindAsEventListener(this.touchStart, this);
		this.tm = webkit_tools.bindAsEventListener(this.touchMove, this);
		this.te = webkit_tools.bindAsEventListener(this.touchEnd, this);		
		
		handle.addEventListener("touchstart", this.ts, false);
		handle.addEventListener("touchmove", this.tm, false);
		handle.addEventListener("touchend", this.te, false);
	}	
	
	this.destroy = function()
	{
		var handle = this.p.handle;
		
		handle.removeEventListener("touchstart", this.ts);
		handle.removeEventListener("touchmove", this.tm);
		handle.removeEventListener("touchend", this.te);	
	}
	
	this.set = function(key, value)
	{
		this.p[key] = value;
	}
	
	this.touchStart = function(event)
	{
		//prepare needed variables
		var p = this.p;
		var r = this.root;
		var rs = r.style;
		var t = event.targetTouches[0];		
		
		//get position of touch
		touchX = t.pageX;
		touchY = t.pageY;
				
		//set base values for position of root
		rs.top = this.root.style.top || '0px';
		rs.left = this.root.style.left || '0px';
		rs.bottom = null;
		rs.right = null;
		
		var rootP = webkit_tools.cumulativeOffset(r);
		var cp = this.getPosition();
		
		//save event properties
		p.rx = cp.x;
		p.ry = cp.y;		
		p.tx = touchX;
		p.ty = touchY;
		p.z = parseInt(this.root.style.zIndex);
		
		//boost zIndex
		rs.zIndex = p.zIndex;
		webkit_drop.prepare();
		p.onStart();
	}
	
	this.touchMove = function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		//prepare needed variables
		var p = this.p;
		var r = this.root;
		var rs = r.style;
		var t = event.targetTouches[0];
		if(t == null){return}
		
		var curX = t.pageX;
		var curY = t.pageY;
		
		var delX = curX - p.tx;
		var delY = curY - p.ty;
		
		rs.left = p.rx + delX + 'px';
		rs.top  = p.ry + delY + 'px';
		
		//scroll window
		if(p.scroll)
		{
			s = this.getScroll(curX, curY);
			if((s[0] != 0) || (s[1] != 0))
			{
				window.scrollTo(window.scrollX + s[0], window.scrollY + s[1]);
			}
		}
		
		//check droppables
		webkit_drop.check(curX, curY, r);
		
		//save position for touchEnd
		this.lastCurX = curX;
		this.lastCurY = curY;
	}
	
	this.touchEnd = function(event)
	{
		var r = this.root;
		var p = this.p;
		var dropped = webkit_drop.finalize(this.lastCurX, this.lastCurY, r, event);
		
		if(((p.revert) && (!dropped)) || (p.revert === 'always'))
		{
			//revert root
			var rs = r.style;
			rs.top = (p.ry + 'px');
			rs.left = (p.rx + 'px');
		}
		
		r.style.zIndex = this.p.z;
		this.p.onEnd();
	}
	
	this.getPosition = function()
	{
		var rs = this.root.style;
		return {x : parseInt(rs.left || 0), y : parseInt(rs.top  || 0)}
	}
	
	this.getScroll = function(pX, pY)
	{
		//read window variables
		var sX = window.scrollX;
		var sY = window.scrollY;
		
		var wX = window.innerWidth;
		var wY = window.innerHeight;
		
		//set contants		
		var scroll_amount = 10; //how many pixels to scroll
		var scroll_sensitivity = 100; //how many pixels from border to start scrolling from.
				
		var delX = 0;
		var delY = 0;		
		
		//process vertical y scroll
		if(pY - sY < scroll_sensitivity)
		{
			delY = -scroll_amount;
		}
		else
		if((sY + wY) - pY < scroll_sensitivity)
		{
			delY = scroll_amount;
		}
		
		//process horizontal x scroll
		if(pX - sX < scroll_sensitivity)
		{
			delX = -scroll_amount;
		}
		else
		if((sX + wX) - pX < scroll_sensitivity)
		{
			delX = scroll_amount;
		}
		
		return [delX, delY]
	}
	
	//contructor
	this.initialize(r, ip);
}

//Description
//webkit_click class. manages click events for draggables

var webkit_click = function(r, ip)
{
	this.initialize = function(root, instance_props)
	{
		var default_props = {onClick : webkit_tools.empty};
		
		this.root = webkit_tools.$(root);
		this.p = webkit_tools.extend(default_props, instance_props || {});
		this.bindEvents();
	}
	
	this.bindEvents = function()
	{
		var root = this.root;
		
		//bind events to local scope
		this.ts = webkit_tools.bindAsEventListener(this.touchStart,this);
		this.tm = webkit_tools.bindAsEventListener(this.touchMove,this);
		this.te = webkit_tools.bindAsEventListener(this.touchEnd,this);
		
		//add Listeners
		root.addEventListener("touchstart", this.ts, false);
		root.addEventListener("touchmove", this.tm, false);
		root.addEventListener("touchend", this.te, false);
		
		this.bound = true;	
	}	
	
	this.touchStart = function()
	{
		this.moved = false;
		if(this.bound == false)
		{
			this.root.addEventListener("touchmove", this.tm, false);
			this.bound = true;
		}
	}
	
	this.touchMove = function()
	{
		this.moved = true;
		this.root.removeEventListener("touchmove", this.tm);
		this.bound = false;
	}
	
	this.touchEnd = function()
	{
		if(this.moved == false)
		{
			this.p.onClick();
		}
	}
	
	this.setEvent = function(f)
	{
		if(typeof(f) == 'function')
		{
			this.p.onClick = f;
		}
	}
	
	this.unbind = function()
	{
		var root = this.root;
		root.removeEventListener("touchstart", this.ts);
		root.removeEventListener("touchmove", this.tm);
		root.removeEventListener("touchend", this.te);
	}
		
	//call constructor
	this.initialize(r, ip);
}