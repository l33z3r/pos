;(function($){

	// sequence: a string of characters to watch for
	// action: a function to execute when the sequence is detected
	// options: a hash of additional options
	jQuery.fn.keySequenceDetector = function(sequence, action, options) {
		var settings = $.extend({}, $.fn.keySequenceDetector.defaultOptions, options);

		return this.each(function() {
			var i = 0;
			$(this).keypress(function(e) {
				var key = String.fromCharCode(e.which);
				if (sequence[i] === key) {
				++i;
					if (sequence.length === i) {
						i = 0;
						action();
					}
				}
				else {
					i = +(sequence[0] === key);
				}
			});
		});
	};

	$.fn.keySequenceDetector.defaultOptions = { 
		// none yet!
	};

})(jQuery);