/**
 *	Neon Register Script
 *
 *	Developed by Arlind Nushi - www.laborator.co
 */

var neonResetPassword = neonResetPassword || {};

;(function($, window, undefined)
{
	"use strict";
	
	$(document).ready(function()
	{
		/*** OC - ADD ***/
		if($("div.form-login-error").attr("data-errors") == "true") {
			var $errors_container = $(".form-login-error");
						
			$errors_container.show();
			var height = $errors_container.outerHeight();
			
			$errors_container.css({
				height: 0
			});
			
			TweenMax.to($errors_container, .45, {css: {height: height}, onComplete: function()
			{
				$errors_container.css({height: 'auto'});
			}});
		}
		/****************/
		
		neonResetPassword.$container = $("#form_reset_password");
/*
		neonResetPassword.$steps = neonResetPassword.$container.find(".form-steps");
		neonResetPassword.$steps_list = neonResetPassword.$steps.find(".step");
		neonResetPassword.step = 'step-1'; // current step
*/
		
				
		neonResetPassword.$container.validate({
			rules: {
				
				new_password: {
					required: true,
					minlength: $('input#new_password').attr('data-value-edges').split("|")[0], 
					maxlength: $('input#new_password').attr('data-value-edges').split("|")[1]
				},	/*** OC - ADD ***/
				new_password_confirm: {
					required: true,
					equalTo: "#new_password"
				},	/*** OC - ADD ***/
			},
			
			messages: {
				
				new_password: {
					required: $('input#new_password').attr('data-message-required'),	/*** OC - ADD ***/
					minlength: $('input#new_password').attr('data-message-edges').split("|")[0],	/*** OC - ADD ***/
					maxlength: $('input#new_password').attr('data-message-edges').split("|")[1]		/*** OC - ADD ***/
				},
				new_password_confirm: {
					required: $('input#new_password_confirm').attr('data-message-required'),	/*** OC - ADD ***/
					equalTo: $('input#new_password_confirm').attr('data-message-not-equal')		/*** OC - ADD ***/
				}
			},
			
			highlight: function(element){
				$(element).closest('.input-group').addClass('validate-has-error');
			},
			
			
			unhighlight: function(element)
			{
				$(element).closest('.input-group').removeClass('validate-has-error');
			},
			
			submitHandler: function(ev)
			{
				$(".login-page").addClass('logging-in');
				
				ev.submit();
			}
		});
		
		
		// Login Form Setup
		neonResetPassword.$body = $(".login-page");
		neonResetPassword.$login_progressbar_indicator = $(".login-progressbar-indicator h3");
		neonResetPassword.$login_progressbar = neonResetPassword.$body.find(".login-progressbar div");
		
		neonResetPassword.$login_progressbar_indicator.html('0%');
		
		if(neonResetPassword.$body.hasClass('login-form-fall'))
		{
			var focus_set = false;
			
			setTimeout(function(){ 
				neonResetPassword.$body.addClass('login-form-fall-init')
				
				setTimeout(function()
				{
					if( !focus_set)
					{
						neonResetPassword.$container.find('input:first').focus();
						focus_set = true;
					}
					
				}, 550);
				
			}, 0);
		}
		else
		{
			neonResetPassword.$container.find('input:first').focus();
		}
		
		
		// Functions
		$.extend(neonResetPassword, {
			setPercentage: function(pct, callback)
			{
				pct = parseInt(pct / 100 * 100, 10) + '%';
				
				// Normal Login
				neonResetPassword.$login_progressbar_indicator.html(pct);
				neonResetPassword.$login_progressbar.width(pct);
				
				var o = {
					pct: parseInt(neonResetPassword.$login_progressbar.width() / neonResetPassword.$login_progressbar.parent().width() * 100, 10)
				};
				
				TweenMax.to(o, .7, {
					pct: parseInt(pct, 10),
					roundProps: ["pct"],
					ease: Sine.easeOut,
					onUpdate: function()
					{
						neonResetPassword.$login_progressbar_indicator.html(o.pct + '%');
					},
					onComplete: callback
				});
			}
		});
	});
	
})(jQuery, window);
