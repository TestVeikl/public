$(document).ready(function() {

/*
	$('input.icheck-1').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal'
	});
*/

	taginput.init();
/*
	taginput.onItemAdd(function(event) {
	  saveajaxform.saveSendForm($(this).attr('id'));
	});
	taginput.onItemRemove(function(event) {
	  saveajaxform.saveSendForm($(this).attr('id'));
	});
*/

	datepicker.init();

	combodynamic.init({
		source_changed: {
			ajax: {
					ajax_type: "GET",
					ajax_params: {"brand_id": "value"}
			}
		},
		rem_button_pressed: {
			callback: function (event, element){
				saveajaxform.saveSendForm(element, event);
			}
		}
	});

	saveajaxform.init();

});
