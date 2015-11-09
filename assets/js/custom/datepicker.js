var datepicker = {};

datepicker.init = function () {
	var dpicker = $(".datepicker");

    if (typeof dpicker !== "undefined") {

	    if ($.isArray(dpicker)) {

		 	$.each(dpicker, function(index, value){
		 		value.datepicker();
			});

		} else {

			dpicker.datepicker();

		}
	}
}
