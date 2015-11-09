//==================================
//! Inizializzazione
//==================================

var combodynamic = {

	defaultConfig: {
		container_class: "combo-dyn-group",
		hide_data_attr: "hide",
		add_button_class: "combo-dyn-add",
		rem_button_class: "combo-dyn-rem",
		src_combo_class: "combo-dyn-source",
		dest_combo_class: "combo-dyn-dest",
		grp_combo_class: "combo-dyn-group",
		add_button_pressed: {
			callback: function(){}
		},
		rem_button_pressed: {
			callback: function(){}
		},
		source_changed: {
			callback: function(){},
			ajax: {
				ajax_url: "/admin/docs/fetch_models",
				ajax_type: "POST",
				ajax_data_type: "json",
				ajax_params: {}	// {key:value, ...} key = nome parametro, value = nome attributo da cui prendere il valore
			}
		},
		dest_changed: {
			callback: function(){}
		},
		data_relation_attr: "data-relation",
		data_counter_attr: "data-counter"
	},

	config: {}

};


combodynamic.init = function (options) {

	if (options !== "undefined") {
		combodynamic.config = $.extend(true, {}, combodynamic.defaultConfig, options);
	}

	// Nascondo i pulsanti "+" delle righe precedenti all'ultima o il pulsante "-" della prima riga se è l'unica riga ed è vuota
	$('.' + combodynamic.config.container_class + ' button[data-' + combodynamic.config.hide_data_attr + '="true"]').hide();
	
	// Se la prima riga è l'unica ma non è vuota, nascondo il pulsante "-"
	if ($("button.combo-dyn-rem").length == 1) {
		$("button.combo-dyn-rem").hide();
	}

	// Assegno evento click ai tasti "+"
	$('body').on("click", 'button[class*="' + combodynamic.config.add_button_class + '"]', function(event){
		combodynamic.onAddButtonPressed(event, $(this));
	});

	// Assegno evento click ai tasti "-"
	$('body').on("click", 'button[class*="' + combodynamic.config.rem_button_class + '"]', function(event){
		combodynamic.onRemoveButtonPressed(event, $(this));
	});

	// Assegno evento change ai combo "source"
	$('body').on("change", 'select[class*="' + combodynamic.config.src_combo_class + '"]', function(event){
		combodynamic.onSourceChanged(event, $(this));
	});

	$('body').on("change", 'select[class*="' + combodynamic.config.dest_combo_class + '"]', function(event){
		combodynamic.onDestChanged(event, $(this));
	});

	var select2Combos = $('select.select2');
	$.each(select2Combos, function(key, combo){
		combo = $(combo);
		console.log(combo);
		combo.siblings('div.select2').attr({
			'data-toggle'		: combo.attr('data-toggle'),
			'data-title-ok'		: combo.attr('data-title-ok'),
			'data-title-ko'		: combo.attr('data-title-ko'),
			'data-html'			: combo.attr('data-html'),
			'data-container'	: combo.attr('data-container'),
			'data-trigger' 		: combo.attr('data-trigger'),
			'data-selector'		: combo.attr('data-selector')
		});
	});

}

//==================================


//==================================
//! Eventi di click su pulsanti
//==================================

combodynamic.onAddButtonPressed = function (event, element) {

	var comboDestArray = $('select.' + combodynamic.config.dest_combo_class);

	if (comboDestArray.last().attr(combodynamic.config.data_counter_attr) != element.attr(combodynamic.config.data_counter_attr)) {
		console.log("return null");
		return null;
	}

	var groupRow 		= element.closest("." + combodynamic.config.grp_combo_class).parent(".row");

	var groupElement	= groupRow.children("." + combodynamic.config.grp_combo_class);

	var counter 		= (parseInt(element.attr(combodynamic.config.data_counter_attr)) + 1);

	var newRow 			= groupRow.clone();
	
	// Se ho premuto il "+" della prima riga rendo visibile il "-" (nel caso in cui fosse l'unica riga)
	if (element.attr(combodynamic.config.data_counter_attr) == 0) {
		$('button[' + combodynamic.config.data_counter_attr + '="0"]').show();
	}

	newRow.find("div.select2-container").remove();

	// Imposto il nuovo id del gruppo
	var newID	= groupElement.attr('id');
	newID 		= newID.substring(0, newID.lastIndexOf('_'));
	newID  		= newID + '_' + counter;
	newRow.children("." + combodynamic.config.grp_combo_class).attr('id', newID);

	// Imposto i nuovi id e name dei combo duplicati
	var comboArray = newRow.find("select");
	$.each(comboArray, function(key, combo){
		combo 	= $(combo);

		var id	= combo.attr("id");
		id 		= id.substring(0, id.lastIndexOf('_'));
		id 		= id + '_' + counter;
		combo.attr("id", id);

		var name	= combo.attr("name");
		name 		= name.substring(0, name.lastIndexOf('_'));
		name 		= name + '_' + counter;
		combo.attr("name", name);

		// Correggo l'attributo counter
		var dataCountAttr		= combodynamic.config.data_counter_attr;
		var newDataCountAttr	= counter;
		combo.attr(dataCountAttr, newDataCountAttr);

		// Correggo l'attributo relation
/*
		var origComboRelation = groupRow.find('select.' + combodynamic.config.src_combo_class);
		combo.attr(combodynamic.config.data_relation_attr, origComboRelation.val());
*/
		combo.attr(combodynamic.config.data_relation_attr, combodynamic.config.grp_combo_class + "-" + newDataCountAttr);

		combo.removeAttr("style");

		combo.off();
	});

	// Imposto i nuovi id e name dei combo duplicati
	var buttonArray = newRow.find("button");
	$.each(buttonArray, function(key, button){
		button 	= $(button);

		var id	= button.attr("id");
		id 		= id.substring(0, id.lastIndexOf('_'));
		id 		= id + '_' + counter;
		button.attr("id", id);

		// Correggo l'attributo counter
		var dataCountAttr		= combodynamic.config.data_counter_attr;
		var newDataCountAttr	= counter;
		button.attr(dataCountAttr, newDataCountAttr);

		// Correggo l'attributo relation
		button.attr(combodynamic.config.data_relation_attr, combodynamic.config.grp_combo_class + "-" + newDataCountAttr);

		button.off();
		
		// Se sto sistemando il pulsante "-" lo rendo visibile (nel caso in cui non lo fosse)
		if (button.hasClass("combo-dyn-rem")) {
			button.show();	
		} else {
			button.addClass("disabled");
		}
		
	});

	// Recupero i combo select2 per reinizializzarli
	var select2Combos = newRow.find('select.select2');

	// Appendo la nuova riga
	groupRow.parent().append(newRow);

	// Reinizializzo gli elementi select2 (se ce ne sono)
	$.each(select2Combos, function(key, combo){
		combo = $(combo);

		// Resetto il valore del campo destinazione
		if (combo.hasClass(combodynamic.config.dest_combo_class)) {
			combo.select2();
			combo.select2("val", 0);
		} else {
			combo.select2();
		}
	});
// 	select2Combos.select2();

	element.hide();
	
	

	combodynamic.config.add_button_pressed.callback(event, element);

}

combodynamic.onRemoveButtonPressed = function (event, element) {

	var counterPrevGroup = parseInt(element.attr(combodynamic.config.data_counter_attr)) - 1;
	
	// Se ho premuto il "-" della prima riga rendo visibile il "-" (nel caso in cui fosse l'unica riga)
	if (counterPrevGroup == 0 && $("button.combo-dyn-rem").length <= 2) {
		$("button.combo-dyn-rem").hide();
	}

	$('.' + combodynamic.config.add_button_class + '[' + combodynamic.config.data_counter_attr + '="' + counterPrevGroup + '"]').show();

/*
	var dataCountAttr	= element.attr(combodynamic.config.data_counter_attr);
	var destElement		= $('.' + combodynamic.config.dest_combo_class + '[' + combodynamic.config.data_counter_attr + '="' + dataCountAttr + '"]');

	destElement.select2("val", 0);
	destElement.val(0);
*/

	element.closest("." + combodynamic.config.grp_combo_class).parent(".row").remove();

	combodynamic.config.rem_button_pressed.callback(event, element);

}

//==================================


//==================================
//! Eventi di change dei combo
//==================================

combodynamic.onSourceChanged = function (event, element) {

	var queryParams = {};

	$.each(combodynamic.config.source_changed.ajax.ajax_params, function(key, value){
		if (value == "value") {
			queryParams[key] = element.val();
		} else {
			queryParams[key] = element.attr(value);
		}
	});

	// Chiamo lo script per ricevere gli elementi relativi al nuovo valore scelto
	$.ajax({
	    url: combodynamic.config.source_changed.ajax.ajax_url,
	    data: queryParams,
	    type: combodynamic.config.source_changed.ajax.ajax_type,
	    dataType: combodynamic.config.source_changed.ajax.ajax_data_type,
	    timeout: 10000,
	    error: function(err)
	    {

	    },
	    success: function(data)
	    {
// 		    var dataRelAttr			= combodynamic.config.data_relation_attr;
		  	var dataCountAttr		= combodynamic.config.data_counter_attr;
		  	var sourceDataCountAttr	= element.attr(dataCountAttr);
		  	var destElement			= $('.' + combodynamic.config.dest_combo_class + '[' + dataCountAttr + '="' + sourceDataCountAttr + '"]');

// 		  	var newDataRelAttr		= element.val();

		  	// Modifico l'attributo di relazione per tutti gli elementi di questa riga
// 			element.attr(dataRelAttr, newDataRelAttr);
// 			destElement.attr(dataRelAttr, newDataRelAttr);

			// Svuoto il combo di destinazione
		  	destElement.html('');

		  	// Inserisco i nuovi valori nel combo di destinazione
		  	$.each(data, function(resultKey, resultValue){
			  	$("<option/>", {
				  	"value": resultKey,
			  	}).text(resultValue).appendTo(destElement);
		  	});

		  	if (destElement.hasClass('select2')) {
			  	destElement.select2("val", destElement.attr('data-placeholder'));
		  	}
		}
	});


	// Eseguo la funzione assegnata come callback
	combodynamic.config.source_changed.callback(event, element);

}

combodynamic.onDestChanged = function (event, element) {

//     var dataRelAttr			= combodynamic.config.data_relation_attr;
  	var dataCountAttr		= combodynamic.config.data_counter_attr;
  	var destDataCountAttr	= element.attr(dataCountAttr);
  	var sourceElement		= $('.' + combodynamic.config.src_combo_class + '[' + dataCountAttr + '="' + destDataCountAttr + '"]');
  	
  	// Abilito il pulsante "+" relativo
  	$('button.combo-dyn-add[' + dataCountAttr + '="' + destDataCountAttr + '"]').removeClass("disabled");

//   	var newDataRelAttr		= sourceElement.val() + '_' + element.val();

  	// Modifico l'attributo di relazione per tutti gli elementi di questa riga
// 	element.attr(dataRelAttr, newDataRelAttr);
// 	sourceElement.attr(dataRelAttr, newDataRelAttr);

	// Eseguo la funzione assegnata come callback
	combodynamic.config.source_changed.callback(event, element);

}

//==================================
