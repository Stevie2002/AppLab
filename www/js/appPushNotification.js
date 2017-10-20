'use strict';

var pushToken;
var pushTokenSent;
var pushInstance;

var pushConfig = {
		'android' : {
			'clearBadge': 'true',
			'iconColor'	: '#000000',
			'osID'		: 2,
		},
		'iOS' : {
			'badge'		: 'true',
			'sound'		: 'true',
			'alert'		: 'true',
			'osID'		: 1,
		},
	};

var push = {
		setConfig : function(options) {
			pushConfig = Object.merge(pushConfig,options);
		},
		
		sendPushToken : function() {
			if(website.loaded && typeof pushToken != 'undefined' && pushTokenSent != true) {
				app.triggerEvent('onLogin',{
					'login' 	: 'appuser',
					'token'		: pushToken,
					'os'		: typeof device != 'undefined' ? pushConfig[device.platform.toLowerCase()].osID : 2,
					'push'		: 1
				});
				pushTokenSent = true;
				console.info('','PushToken sent');
			}
		},
		
		onInitialize : function() {
			console.info('','push.onInitialize');
			
			var token	= window.localStorage.getItem('pushToken')
			
			if(token) {
				pushToken = token;
				console.success('','>  PushToken loaded');
			}
		},
		
		onDeviceReady : function() {
			console.info('','push.onDeviceReady');
			
			pushInstance = PushNotification.init(pushConfig);
				
			pushInstance.on('error', push.onError);
			pushInstance.on('registration', push.onRegister);
			pushInstance.on('notification', push.onNotification);
			
			pushInstance.on('btnUpdate', push.btnUpdate);
			pushInstance.on('btnDissmiss', push.btnDissmiss);
				
			console.success('','>  Push initialized');
		},
		
		onRegister : function(data) {
			console.info('push.onRegister','Loaded');
			
			if(pushToken != data.registrationId) {
				pushTokenSent = false;
			}
			
			pushToken = data.registrationId;
			window.localStorage.setItem('pushToken',pushToken);
			
			push.sendPushToken();
		},
		
		onNotification : function(data) {
			// console.info('push.onNotification',event.event);
			
			console.line();
			
			console.log(' > Title',data.title);
			console.log(' > Message',data.message);
			console.log(' > Badge',data.count);
			console.log(' > Sound',data.sound);
			console.log(' > Image',data.image);
			
			for( var key in data.additionalData) {
				console.log(' > '+key,data.additionalData[key]);
			}
			
			if( data.additionalData.foreground )
			{
				console.log('Method','inline notification');
			}
			else if( data.additionalData.coldstart )
			{
				console.log('Method','coldstart notification');
			}
			else
			{
				console.log('Method','background notification');
			}
			
			console.log('Time',data.additionalData.datetime);
			console.log('Subjec',data.title);
			console.log('Message',data.message);
			
			if(typeof data.additionalData.command != 'undefined') {
				console.info('Exec Command',data.additionalData.command.env+'.'+data.additionalData.command.action);
				console.line();
				app.parseCommands(data.additionalData.command);
			}
			
			console.line();
		},
		
		onError : function(event) {
			console.error('push.onError',event.message);
		},
		
		btnDissmiss : function(event) {
			console.info('push.btnDissmiss','Clicked');
		},
		
		btnUpdate : function(event) {
			console.info('push.btnUpdate','Clicked');
			window.open('https://build.phonegap.com/apps/2842512/download/android/?qr_key=mumpGaziGVtNsBZV1D5z','_system','');
		},
	};

appConfig.onDeviceReady.push(push.onDeviceReady);
appConfig.onWebsiteReady.push(push.sendPushToken);
appConfig.onInitialize.push(push.onInitialize);