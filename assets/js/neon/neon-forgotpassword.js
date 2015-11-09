/**
 *	Neon Register Script
 *
 *	Developed by Arlind Nushi - www.laborator.co
 */

var neonForgotPassword = neonForgotPassword || {};

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
		
		neonForgotPassword.$container = $("#form_forgot_password");
/*
		neonForgotPassword.$steps = neonForgotPassword.$container.find(".form-steps");
		neonForgotPassword.$steps_list = neonForgotPassword.$steps.find(".step");
		neonForgotPassword.step = 'step-1'; // current step
*/
		
				
		neonForgotPassword.$container.validate({
			rules: {
				
				email: {
					required: true,
					email: true
				},
				username: "required"	/*** OC - ADD ***/
				
			},
			
			messages: {
				
				email: {
					required: $('input#email').attr('data-message-required'),	/*** OC - ADD ***/
					email: $('input#email').attr('data-message-invalid-email')	/*** OC - MOD ***/
				},
				username: $('input#username').attr('data-message-required')	/*** OC - ADD ***/
				
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
		neonForgotPassword.$body = $(".login-page");
		neonForgotPassword.$login_progressbar_indicator = $(".login-progressbar-indicator h3");
		neonForgotPassword.$login_progressbar = neonForgotPassword.$body.find(".login-progressbar div");
		
		neonForgotPassword.$login_progressbar_indicator.html('0%');
		
		if(neonForgotPassword.$body.hasClass('login-form-fall'))
		{
			var focus_set = false;
			
			setTimeout(function(){ 
				neonForgotPassword.$body.addClass('login-form-fall-init')
				
				setTimeout(function()
				{
					if( !focus_set)
					{
						neonForgotPassword.$container.find('input:first').focus();
						focus_set = true;
					}
					
				}, 550);
				
			}, 0);
		}
		else
		{
			neonForgotPassword.$container.find('input:first').focus();
		}
		
		
		// Functions
		$.extend(neonForgotPassword, {
			setPercentage: function(pct, callback)
			{
				pct = parseInt(pct / 100 * 100, 10) + '%';
				
				// Normal Login
				neonForgotPassword.$login_progressbar_indicator.html(pct);
				neonForgotPassword.$login_progressbar.width(pct);
				
				var o = {
					pct: parseInt(neonForgotPassword.$login_progressbar.width() / neonForgotPassword.$login_progressbar.parent().width() * 100, 10)
				};
				
				TweenMax.to(o, .7, {
					pct: parseInt(pct, 10),
					roundProps: ["pct"],
					ease: Sine.easeOut,
					onUpdate: function()
					{
						neonForgotPassword.$login_progressbar_indicator.html(o.pct + '%');
					},
					onComplete: callback
				});
			}
		});
	});
	
})(jQuery, window);
