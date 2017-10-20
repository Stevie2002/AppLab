'use strict';

var console = {
		org		: window.console.log,
		log		: function(label,message) { console.parse(label,message,'default'); },
		info	: function(label,message) { console.parse(label,message,'info'); },
		success	: function(label,message) { console.parse(label,message,'success'); },
		warn	: function(label,message) { console.parse(label,message,'warning'); },
		error	: function(label,message) { console.parse(label,message,'error'); },
		
		line : function() {
			jQuery('#console [rel=log]').append('<HR/>');
		},
		
		show : function() {
			jQuery('#console').show();
		},
		
		hide : function() {
			jQuery('#console').hide();
		},
		
		close : function() {
			jQuery('#console [rel=toolbar] LI[rel=open]').show();
			jQuery('#console [rel=toolbar] LI[rel=close]').hide();
			jQuery('#console [rel=toolbar] LI:not([rel=open]):not([rel=close])').fadeOut();
			jQuery('#console [rel=log]').css('max-height','25vh');
			jQuery('#console').css('top','100vh');
		},
		
		open : function() {
			jQuery('#console [rel=toolbar] LI[rel=open]').hide();
			jQuery('#console [rel=toolbar] LI[rel=reduce]').hide();
			jQuery('#console [rel=toolbar] LI[rel=close]').show();
			jQuery('#console [rel=toolbar] LI:not([rel=open]):not([rel=close]):not([rel=reduce])').fadeIn();
			jQuery('#console').css('top','75vh');
		},
		
		reduce : function() {
			jQuery('#console [rel=toolbar] LI[rel=reduce]').hide();
			jQuery('#console [rel=toolbar] LI[rel=expand]').show();
			jQuery('#console [rel=log]').css('max-height','25vh');
			jQuery('#console').css('top','75vh');
		},
		
		expand : function() {
			jQuery('#console [rel=toolbar] LI[rel=expand]').hide();
			jQuery('#console [rel=toolbar] LI[rel=reduce]').show();
			jQuery('#console').css('top','25px');
			jQuery('#console [rel=log]').css('max-height','100vh');
		},
		
		reset : function() {
			jQuery('#console [rel=log]').html('');
		},
		
		parse : function(label,message,color) {
			label	= label || '';
			message	= message || '';
			
			if(label.length <= 20) {
				for(var j = label.length ; j < 20 + 2; j++) {
					label = label + '.';
				}
				
				label	= label + ': ';
			}
			
			jQuery('#console [rel=log]').append('<DIV><span class="text-'+color+'">'+label+'</span>'+message+'</DIV>');
		},
	};