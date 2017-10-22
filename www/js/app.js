'use strict';

jQuery.support.cors = true;

var website = document.getElementById('website');

var appOnline = false;
var appConfig = {
		'updateUrl' 	: 'https://applab.thenetworks.de/version.php',
		'websiteUrl' 	: 'https://applab.thenetworks.de',
		'onInitialize'	: [],
		'onDeviceReady'	: [],
		'onWebsiteReady': [],
		'onContentReady': [],
	};

var app = {
		setConfig : function(options) {
			appConfig = Object.assign(appConfig,options);
		},
		
		onInitialize: function() {
			console.info('app.onInitialize','Loaded');
			
			window.addEventListener('message', app.onReceiveMessage, false);
			
			website.loaded	= false;
			website.onload	= app.onWebsiteReady;
			website.src		= appConfig.websiteUrl;
			
			for(var i in appConfig.onInitialize) {
				appConfig.onInitialize[i]();
			}
		},
		
		onDomReady: function() {
			if(typeof window.cordova != 'undefined')
			{
				console.info('app.onDomReady','running on DEVICE');
				document.addEventListener('online', app.onOnline, false);
				document.addEventListener('offline', app.onOffline, false);
				document.addEventListener('deviceready', app.onDeviceReady, false);
				
			}
			else {
				console.info('app.onDomReady','running on DESKTOP');
				app.onInitialize();
			}
		},
		
		onOnline : function() {
			if(!appOnline) {
				console.success('app.onOnline','Loaded');
				jQuery('#offline').css('display','none');
				appOnline = true;
			}
		},
		
		onOffline : function() {
			if(appOnline) {
				console.error('app.onOffline','Loaded');
				jQuery('#offline').css('display','block');
				appOnline = false;
			}
		},
		
		onFail : function(error){
			console.error(JSON.stringify(error));
		},
		
		onSuccess : function(error){
			console.success(JSON.stringify(error));
		},
		
		onWebsiteReady : function() {
			if(!website.loaded) {
				app.triggerEvent('onWebsiteLoading');
				
				website.loaded	= true;
				
				console.success('app.onWebsiteReady','Loaded');
				for(var i in appConfig.onWebsiteReady) {
					appConfig.onWebsiteReady[i]();
				}
				
				if(typeof navigator.splashscreen != 'undefined') {
					navigator.splashscreen.hide();
				}
				
				app.triggerEvent('onWebsiteReady');
			}
		},
		
		onContentReady : function() {
			app.onWebsiteReady();
			
			console.success('app.onContentReady','Loaded');
			for(var i in appConfig.onContentReady) {
				appConfig.onContentReady[i]();
			}
		},
		
		onDeviceReady: function() {
			console.info('app.onDeviceReady','running on '+device.platform);
			
			if(typeof window.BuildInfo != 'undefined') {
				console.log('','BuildInfo');
				console.log('',' > '+BuildInfo.packageName);
				console.log('',' > Name.: '+BuildInfo.name);
				console.log('',' > Vers.: '+BuildInfo.version);
			}
			
			app.checkUpdate();
			app.onInitialize();
			
			for(var i in appConfig.onDeviceReady) {
				appConfig.onDeviceReady[i]();
			}
		},
		
		onReceiveMessage : function(event) {
			var data = typeof event.data == 'object' ? event.data : JSON.parse(event.data).additionalData;
			console.info('app.onReceiveMessage','app > '+data.action);
			app.parseCommands(Object.merge({
				'env' : 'app'
			},data));
		},
		
		checkUpdate : function(params) {
			if(typeof window.BuildInfo != 'undefined') {
				jQuery.ajax({
					dataType: 'json',
					cache	: false,
					url		: appConfig.updateUrl,
					data	: {
						version : params=='force' ? '0.0.0' : BuildInfo.version,
					},
					success	: function(data){
						if(data.available) {
							console.warn('app.checkUpdate','Update Available');
							console.warn('',' > Vers.: '+data.version);
							console.warn('',' > Build: '+data.build);
							if(params=='force') {
								window.open(data.updateUrl,'_system','');
							} else {
								navigator.notification.confirm(data.message, app.btnDialogUpdate, data.title, [data.button1,data.button2])
							}
						} else {
							console.info('app.checkUpdate','No Update Available');
						}
					},
				});
			}
		},
		
		forceUpdate : function() {
			app.checkUpdate('force');
		},
		
		btnDialogUpdate : function(buttonIndex) {
			if(buttonIndex == 1) {
				app.checkUpdate('force');
			}
		},
		
		triggerEvent : function(eventName,data) {
			website.contentWindow.postMessage(Object.merge({
				'trigger' : eventName
			},data),'*');
		},
		
		parseCommands : function(data) {
			switch(data.env)
			{
				case 'app' :
					var namespaces	= data.action.split('.');
					var context		= window[namespaces.shift()];
					
					for(var i = 0; i < namespaces.length; i++) {
						context = context[namespaces[i]];
					}
					
					if(typeof context != 'undefined') context.apply(context,data.args);
					break;
			}
		},
	};

document.addEventListener('DOMContentLoaded', app.onDomReady, false);