//==================================
//! Inizializzazione
//==================================

var taginput = {

	defaultConfig: {
		selector: ".tagsinput2",
		url_data_attr: "data-remote",
		wildcard: "%QUERY",
		item_added_callback: function(){},
		item_removed_callback: function(){},
		modal_button_class: "modal-handle-tag",
		data_modal_insert_url: "data-modal-insert-url",
		data_modal_delete_url: "data-modal-delete-url",
		data_relation_attr: "data-relation"
	},

	config: {},

};

taginput.init = function (options) {

	if (options !== "undefined") {
		taginput.config = $.extend(true, {}, taginput.defaultConfig, options);
	}

	var vkltags = new Bloodhound({
	  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
	  queryTokenizer: Bloodhound.tokenizers.whitespace,
	  remote: {
	    url: $(taginput.config.selector).attr(taginput.config.url_data_attr),
	    wildcard: taginput.config.wildcard,
	    filter: function(list) {
	      return $.map(list, function(value, key) {
			  return { "text": value.TagDescription, "id": value.TagID };
	      });
	    }
	  }
	});
	vkltags.initialize();

	$(taginput.config.selector).tagsinput({
		itemValue: "id",
		itemText: "text",
		typeaheadjs: {
			name: 'vkltags',
			displayKey: 'text',
// 			valuKey: 'id',
			source: vkltags.ttAdapter(),
			templates:{
			    suggestion: function(e) { return '<div><p>' + e.text + '</p></div>';}
			}
		},
		trimValue: true
	});

	// Aggiungo ad ogni campo tag i tag già assegnati
	$.each($(taginput.config.selector), function(key, element){
		element = $(element);

		var values = element.attr(taginput.config.data_relation_attr).split(",");
		
		if (values.length > 0 && values[0] != ""){
			$.each(values, function(key, value){
				value = value.split("|");
				element.tagsinput("add", { "id": value[0], "text": value[1]});
			});
		}
	});

	$(taginput.config.selector + ":not(#txi_handle_tag)").on('itemAdded', function(event){taginput.onItemAdd(event)});
	$(taginput.config.selector + ":not(#txi_handle_tag)").on('itemRemoved', function(event){taginput.onItemRemove(event)});

	// Blocco il backspace sugli input se sono vuoti per non far cancellare i tag col backspace
	$('.bootstrap-tagsinput input:not(#txi_handle_tag)').on('keydown', function(event){
		if (event.keyCode === 37 || (event.keyCode === 8 && $(this).val().length == 0)) {
			event.preventDefault();
	        return false;
	    }
	});

	/*** Inizializzazione modal gestione Tag ***/
	if ($('button.' + taginput.config.modal_button_class).length > 0) {

		$('body').append('<div class="modal fade" id="modal-handle-tag" data-backdrop="static">' +
							'<div class="modal-dialog">' +
								'<div class="modal-content">' +
									'<div class="modal-header">' +
									'<button type="button" id="close_handle_tag_modal" class="close" aria-hidden="true"><i class="entypo-cancel"></i></button>' +
										'<h4 class="modal-title">' + $('button.' + taginput.config.modal_button_class).attr("data-modal-header") + '</h4>' +
									'</div>' +
									'<div class="modal-body">' +
										'<div class="row" style="margin-bottom: 10px">' +
											'<div class="col-xs-12">' +
												'<div class="scrollable" data-height="300">' +
													'<table id="tags_table" class="table table-striped table-bordered table-condensed">' +
														'<tbody></tbody>' +
													'</table>' +
												'</div>' +
											'</div>' +
										'</div>' +
										'<div class="row">' +
											'<div class="col-xs-9 col-sm-10">' +
												'<div class="form-group">' +
													'<input type="text" id="txi_handle_tag" name ="txi_handle_tag" class="form-control" data-remote="' + $('.' + taginput.config.modal_button_class).attr(taginput.config.url_data_attr) + '">' +
												'</div>' +
											'</div>' +
											'<div class="col-xs-3 col-sm-2">' +
												'<button type="button" id="add_tag_button" class="btn btn-primary btn-modal-handle-tag add disabled" data-loading-text="' + $('button.' + taginput.config.modal_button_class).attr("data-modal-button-add-loading") + '">' +
												$('button.' + taginput.config.modal_button_class).attr("data-modal-button-add") +
												'</button>' +
											'</div>' +
										'</div>' +
									'</div>' +
									'<!--<div class="modal-footer"></div>-->' +
								'</div>' +
							'</div>' +
						'</div>');
						
		$('body').append('<div class="modal fade" id="modal_confirm_del" data-backdrop="static">' +
							'<div class="modal-dialog">' +
								'<div class="modal-content">' +
									'<div class="modal-body">' +
									'</div>' +
									'<div class="modal-footer">' +
										'<button type="button" id="cancel_del_tag_button" class="btn btn-default" data-dismiss="modal">' +
												$('button.' + taginput.config.modal_button_class).attr("data-modal-button-cancel") +
										'</button>' +
										'<button type="button" id="confirm_del_tag_button" class="btn btn-danger" data-dismiss="modal">' +
												$('button.' + taginput.config.modal_button_class).attr("data-modal-button-del") +
										'</button>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>');

		$("button." + taginput.config.modal_button_class).on("click", function(event){saveajaxform.saveEnabled = 0; taginput.onHandleButtonPressed(event)});
		$("#close_handle_tag_modal").on("click", function(){
			$("#modal-handle-tag").modal("hide");
			saveajaxform.saveEnabled = 1;
		});
		$("#tags_table").on("click", ".btn-del-tag", function(){taginput.deleteTagFromModal($(this)[0].id.replace("tag_del_btn_", ""), false)});
		$("button#add_tag_button").on("click", function(event){taginput.addTagFromModal(event)});
		$("input#txi_handle_tag").on('keyup', function(event){
			if ($(this).val().length >= 3) {
				$("button#add_tag_button").removeClass("disabled");
		    } else {
			    $("button#add_tag_button").addClass("disabled");
		    }
		});
		$("#confirm_del_tag_button").on("click", function(){
			taginput.deleteTagFromModal($("#modal_confirm_del").attr("data-relation"), true);
			$("#modal_confirm_del").modal("hide");
			taginput.getTags();
		});
		
		$("#cancel_del_tag_button").on("click", function(){
			$("#modal_confirm_del").modal("hide");
		});
	}
	/*******************************************/

}

//==================================


//==================================
//! Eventi
//==================================

taginput.onItemAdd = function (event) {

	taginput.config.item_added_callback(event);

}

taginput.onItemRemove = function (event) {

	taginput.config.item_removed_callback(event);

}

taginput.onHandleButtonPressed = function (event) {

	taginput.getTags();
	$('#modal-handle-tag').modal("show");

}

taginput.addTagFromModal = function (event) {

	if ($("#txi_handle_tag").val().length == 0) {
		return false;
	}

	$("#add_tag_button").button("loading");

	var inputText = $("#txi_handle_tag").val();

	$.ajax({
	    url: $("button." + taginput.config.modal_button_class).attr(taginput.config.data_modal_insert_url),
	    data: {"TagDescription": inputText},
	    type: "POST",
	    dataType: "json",
	    timeout: 5000,
	    success: function(data)
	    {
		    $("#txi_handle_tag").val("");
		    taginput.getTags();
		}
	});

	$("#add_tag_button").button("reset");

}

taginput.deleteTagFromModal = function (id, force) {
	id = parseInt(id);
	console.log({"TagID": id, "force": force});
	$.ajax({
	    url: $("button." + taginput.config.modal_button_class).attr(taginput.config.data_modal_delete_url),
	    data: {"TagID": id, "force": force},
	    type: "POST",
	    dataType: "json",
	    timeout: 5000,
	    success: function(data)
	    {
		    
		    if (!force && data.count > 0) {
				
				$("#modal_confirm_del").attr("data-relation", id);
				$("#modal_confirm_del .modal-body").html('<p >' + data.message + '</p>');
				$("#modal_confirm_del").modal("show");

		    } else {

				if (data.status === "ok") {
					
					$("#modal_confirm_del").attr("data-relation", "");
					$("#tags_table tr#tag_row_" + id).remove();
					
				}
				
				/*
					Se il tag cancellato era assegnato al documento corrente,
					disabilito l'evento change sul campo dei tag, rinfresco il campo e
					ripristino l'evento
				*/
				if (force) {

					$(taginput.config.selector).tagsinput("remove", {"id":id});
					$(taginput.config.selector).tagsinput("refresh");
					
					var items = $(taginput.config.selector).tagsinput("items");
			
					var tempItemsArray = [];
					$.each(items, function(key, item){
						tempItemsArray[key] = item.id + "|" + item.text;
					});
					
					$(taginput.config.selector).attr(taginput.config.data_relation_attr, tempItemsArray.join(","));
					
				}
				
				taginput.getTags();

		    }

		}
	});


// 	.triggerHandler( event [, extraParameters ] )
}

taginput.getTags = function () {

	$.post($("button." + taginput.config.modal_button_class).attr(taginput.config.url_data_attr), function(data){
		$("#tags_table tbody").html("");

		$.each($.parseJSON(data), function(key, value){
			var tableRow = $("<tr/>", {
				"id": "tag_row_" + value.TagID
			});

			var descriptionCell	= $("<td/>", {
				"class": "col-xs-11",
				"style": "vertical-align: middle;"
			}).html("<strong>" + value.TagDescription + "</strong>").appendTo(tableRow);

			var actionCell 		= $("<td/>", {
				"class": "col-xs-1"
			}).appendTo(tableRow);

			var cancelButton	= $("<button/>", {
										"id": "tag_del_btn_" + value.TagID,
										"type": "button",
										"class": "btn btn-danger btn-sm btn-del-tag"
									}).html('<i class="entypo-trash"></i>').appendTo(actionCell);

			tableRow.appendTo($("#tags_table tbody"));
		});
	});

}
