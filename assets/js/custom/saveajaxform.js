//==================================
//! Inizializzazione
//==================================

var saveajaxform = {

	defaultConfig: {
		tooltip_container_tooltip_selector: "body",
		tooltip_selector: ".tooltip",
		tooltip_toggle_data_attr: "tooltip",
		tooltip_success_class: "tooltip-primary",
		tooltip_failure_class: "tooltip-secondary",
		tooltip_orig_title_data_attr: "data-original-title",
		tooltip_title_ok_data_attr: "data-title-ok",
		tooltip_title_ko_data_attr: "data-title-ko",
		tooltip_relation_classes:["select2"],
		tooltip_duration: 400,
		ajax_url: "/admin/docs/live_save",
		ajax_type: "POST",
		ajax_data_type: "json",
		ajax_timeout: 10000,
		bind_params: [{
			text: {
				selector: 'input[type="text"]',
				event: "change",
				exclude: 'input[class*="tt-input"],#txi_handle_tag'
			},
		},
		{
			checkbox: {
				selector: 'input[type="checkbox"]',
				event: "click",
				exclude: ''
			}
		},
		{
			radio: {
				selector: 'input[type="radio"]',
				event: "click",
				exclude: ''
			}
		},
		{
			textarea: {
				selector: 'input[type="textarea"]',
				event: "change",
				exclude: ''
			}
		},
		{
			select: {
				selector: 'select',
				event: "change",
				exclude: 'select[id*="sdyn"]'
			}
		},
		{
			file: {
				selector: 'input[type="file"]',
				event: "change",
				exclude: ''
			},
		}],
		data_relation_attr: "data-relation",
		data_last_value_attr: "data-last-value"
	},

	config: {},
	
	saveEnabled: 1

};

saveajaxform.init = function (options) {

	if (options !== "undefined") {
		saveajaxform.config = $.extend(true, {}, saveajaxform.defaultConfig, options);
	}

	// Inizializzo i tooltip
	$(saveajaxform.config.tooltip_container_tooltip_selector).tooltip();

	// Sull'evento di visualizzazione imposto il colore del tooltip
	$('[data-toggle="' + saveajaxform.config.tooltip_toggle_data_attr + '"]').on('shown.bs.tooltip', function(){

		if ($(this).attr(saveajaxform.config.tooltip_orig_title_data_attr) === $(this).attr(saveajaxform.config.tooltip_title_ko_data_attr)) {

        	$(saveajaxform.config.tooltip_selector).addClass(saveajaxform.config.tooltip_failure_class);

        } else {

	        $(saveajaxform.config.tooltip_selector).addClass(saveajaxform.config.tooltip_success_class);

        }
    });

	// Eseguo il bind degli eventi per tutti gli elementi del form
    $.each(saveajaxform.config.bind_params, function(arrayKey, arrayEelement){
	    $.each(arrayEelement, function(paramKey, paramValue){
		   saveajaxform.objectsBindEvents(paramValue.selector, paramValue.event, paramValue.exclude, paramKey);
	    });
    });

	$("body").on("click", ".btn-ajax-error", function(event) {

		saveajaxform.onAJAXError(event, $(this));

	});

}

saveajaxform.objectsBindEvents = function (selector, bindEvent, exclude_selector, elementType) {

/*
	$(selector).not(exclude_selector).bind(bindEvent,function() {

		saveajaxform.saveSendForm($(this));

	});
*/

	$("body").on(bindEvent, selector + ":not(" + exclude_selector + ")", function(event) {
		saveajaxform.saveSendForm($(this), event);

	});

}

//==================================


//==================================
//! Utility
//==================================

saveajaxform.saveSendForm = function (element, event) {
	
	if (saveajaxform.saveEnabled == 0) {
		return false;
	}

	element = $(element);
	console.log(element);
	var id_submit		= element.attr("id");

	var elementID		= id_submit.split('_');

	var dataRelAttr		= element.attr(saveajaxform.config.data_relation_attr);

	var dataLastValAttr	= element.attr(saveajaxform.config.data_last_value_attr);

	var elementValue	= undefined;
	var processData		= true;
	var contentType		= "application/x-www-form-urlencoded; charset=UTF-8";
	var timeout			= saveajaxform.config.ajax_timeout;
	
	if (element.is(':checkbox')) {

		elementValue = (element.is(":checked") ? 1 : 0);
		
	}
	else if (element.is(':radio')) {

		if (dataLastValAttr == element.val()) {
			// Gestisco i radio con stile custom
			if (element.closest("div").hasClass("radio-replace")) {
				element.closest("div").removeClass("checked");
			}

			element.removeAttr("checked");
			elementValue = 0;
			
		} else {
			$.each($("input[name=" + element.attr("name") + "]"), function(key, value){
				value = $(value);
				if (value.attr(saveajaxform.config.data_relation_attr) != "") {
					dataRelAttr = value.attr(saveajaxform.config.data_relation_attr);
				}
			});
			elementValue = element.val();
		}

		elementValue = (element.is(":checked") ? element.val() : 0);

	}
	else if (element.is('.tagsinput2')) {

		var items = element.tagsinput("items");
		
		console.log(items);

		elementValue = '';

		var tempItemsArray = [];
		$.each(items, function(key, item){
			tempItemsArray[key] = item.id + "|" + item.text;
		});

		elementValue = tempItemsArray.join(",");

	}
	else {

		elementValue = element.val();

	}

	var queryParams = {
		"field_type"		: elementID[0],
		"doc_id" 			: elementID[1],
		"object_id" 		: elementID[2],
		"property_id" 		: elementID[3],
		"property_value" 	: elementValue,
		"property_inc_id"	: dataRelAttr
	};

	// Se sto uploadando un file creo il FormData ed invio quello invece che i parametri normali
	if (element.is(":file")) {
		console.log(event.target.files);
		var button	= element.closest("a.file2");
		button.attr("data-loading-text", element.attr("data-loading"));
		button.button("loading");

		elementValue = [];

		var data = new FormData();

		$.each(event.target.files, function(key, value){
			data.append("file", value);
			elementValue[key] = value.name;
		});

		queryParams.property_value = elementValue;

		$.each(queryParams, function(key, value){
			data.append(key, value);
		});

		queryParams = data;

		processData = false;
		contentType = false;
		timeout		= 0;

	}

	console.log(queryParams);
	$.ajax({
	    url: saveajaxform.config.ajax_url,
	    data: queryParams,
	    type: saveajaxform.config.ajax_type,
	    dataType: saveajaxform.config.ajax_data_type,
	    processData: processData,
	    contentType: contentType,
	    timeout: timeout,
	    error: function(XHR, status, error)
	    {
		    if (typeof button !== "undefined") {
			    button.button("reset");
		    }

			$('body').append('<div class="modal fade" id="modal-ajax-error" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + status + '</h4></div><div class="modal-body"><strong>' + error + '</strong></div><div class="modal-footer"><button type="button" class="btn btn-info btn-ajax-error" data-dismiss="modal">Ok</button></div></div></div></div>');

			$("#modal-ajax-error").modal("show", {backdrop: 'static'});
	    },
	    success: function(data)
	    {
		    if (typeof button !== "undefined") {
			    button.button("reset");
		    }

		    console.log(data);
		    // In base alla risposta aggiusto l'attributo di relazione
		    if (data.new_property_inc_id) {

			    // Aggiusto l'attributo sui fratelli (caso dei combo dynamici che hanno anche i pulsanti)
			    if (!element.is(":checkbox")) {
			    	$('[' + saveajaxform.config.data_relation_attr + '="' + element.attr(saveajaxform.config.data_relation_attr) + '"]').attr(saveajaxform.config.data_relation_attr, data.new_property_inc_id);
			    }

			    // Aggiungo l'attributo a tutti i fratelli se è un radio
			    if (element.is(':radio')) {
			    	$('input[name="' + element.attr("name") + '"]').attr(saveajaxform.config.data_relation_attr, data.new_property_inc_id);
			    }

			    // Aggiusto l'attributo sull'elemento stesso
			    element.attr(saveajaxform.config.data_relation_attr, data.new_property_inc_id);
			    console.log(element);
		    } else {
			    element.attr(saveajaxform.config.data_relation_attr, '');
		    }

		    // In base allo status della risposta mostro il messaggio appropriato
		    if (data.status == "ok") {
			    if (element.is(':radio')) {
			    	$('input[name="' + element.attr("name") + '"]').attr(saveajaxform.config.data_last_value_attr, elementValue);
					element.attr(saveajaxform.config.data_last_value_attr, elementValue);
			    }
				
			    if (typeof data.message != "undefined") {
				    element.attr(saveajaxform.config.tooltip_orig_title_data_attr, data.message.text);
			    } else {
				    element.attr(saveajaxform.config.tooltip_orig_title_data_attr, element.attr(saveajaxform.config.tooltip_title_ok_data_attr));
			    }

			    element.tooltip('show');
			    setTimeout(function(){element.tooltip('hide')}, saveajaxform.config.tooltip_duration);

				// Triggero il tooltip anche sugli oggetti che rimpiazzano gli input classici
			    $.each(saveajaxform.config.tooltip_relation_classes, function(key, className){
				   if (element.hasClass(className)) {
					   $.each(element.siblings(), function(key, sibling){
					    sibling = $(sibling);
					    if (sibling.hasClass(className)) {
						    sibling.attr(saveajaxform.config.tooltip_orig_title_data_attr, element.attr(saveajaxform.config.tooltip_orig_title_data_attr));
						    sibling.attr("data-container", element.attr("data-container"));
						    sibling.attr("data-html", element.attr("data-html"));
						    sibling.attr("data-trigger", element.attr("data-trigger"));
						    sibling.attr("data-selector", element.attr("data-selector"));
						    sibling.tooltip('show');
						    setTimeout(function(){sibling.tooltip('hide')}, saveajaxform.config.tooltip_duration);
					    }
				    });
				   }
			    });

		    } else {

				$('body').append('<div class="modal fade" id="modal-ajax-error" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + data.message.title + '</h4></div><div class="modal-body"><strong>' + data.message.text + '</strong></div><div class="modal-footer"><button type="button" class="btn btn-info btn-ajax-error" data-dismiss="modal">Ok</button></div></div></div></div>');

				$("#modal-ajax-error").modal("show", {backdrop: 'static'});

		    }
		}
	});

}

saveajaxform.onAJAXError = function (event, element) {
	location.reload();
}

//==================================
