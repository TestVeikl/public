$(document).ready(function() {

	$('#searchfield_brand').on("change",function() {
		
		if ($(this).val() == 0) {
			$('#searchfield_model').attr('disabled', '');
		} else {
			loadModels($(this).val());
// 			loadYears($(this).val(), null);
		}

	});
	
/*
	$('#searchfield_model').on("change",function() {
		
		if ($(this).val() > 0) {
			loadYears($('#searchfield_model').val(), $(this).val());	
		}

	});
*/
	
});

function loadModels(brand) {
	
	$.ajax({
	    url: "/search/fetch_models",
	    data: {"brand_id": brand},
	    type: 'POST',
	    dataType: 'json',
	    timeout: 10000,
	    error: function(err)
	    {
// 		    console.log(err);
	    },
	    success: function(data)
	    {
		    
		    $('#searchfield_model').find("option:gt(0)").remove();
		    
		    $.each(data, function(key, value){
			    $('#searchfield_model').append($("<option />").val(key).text(value));	
		    });
		    
		    $('#searchfield_model').removeAttr('disabled');
		}
	});
	
}

/*
function loadYears(brand, model) {
	
	$.ajax({
	    url: "/search/fetch_years",
	    data: {"brand_id": brand, "model_id": model},
	    type: 'POST',
	    dataType: 'json',
	    timeout: 10000,
	    error: function(err)
	    {
		    console.log(err);
	    },
	    success: function(data)
	    {
		    $('#searchfield_year').find("option:gt(0)").remove();
		    
		    $.each(data, function(key, value){
			    $('#searchfield_model').append($("<option />").val(key).text(value));	
		    });
		    
		    $('#searchfield_model').removeAttr('disabled');
		}
	});
	
}
*/
