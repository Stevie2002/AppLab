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
			var token	= window.localStorage.getItem('pushToken')
			
			if(token) {
				pushToken = token;
				console.success('push.onInitialize','PushToken loaded');
			}
		},
		
		onDeviceReady : function() {
			// console.info('','push.onDeviceReady');
			
			pushInstance = PushNotification.init(pushConfig);
				
			pushInstance.on('error', push.onError);
			pushInstance.on('registration', push.onRegister);
			pushInstance.on('notification', push.onNotification);
			
			pushInstance.on('btnSend', push.btnSend);
			pushInstance.on('btnUpdate', push.btnUpdate);
			pushInstance.on('btnDissmiss', push.btnDissmiss);
				
			console.success('push.onDeviceReady','Push initialized');
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
			if( data.additionalData.foreground )
			{
				console.info('push.onNotification','inline notification');
			}
			else if( data.additionalData.coldstart )
			{
				console.info('push.onNotification','coldstart notification');
			}
			else
			{
				console.info('push.onNotification','background notification');
			}
			
			console.line();
			
			console.log(' > Title',data.title);
			console.log(' > Message',data.message);
			console.log(' > Badge',data.count);
			console.log(' > Sound',data.sound);
			console.log(' > Image',data.image);
			
			for( var key in data.additionalData ) {
				console.log(' > '+key,data.additionalData[key]);
			}
			
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
		
		btnSend : function(data) {
			console.info('push.btnSend','Clicked');
			console.log(JSON.stringify(data));
		},
		
		btnUpdate : function(data) {
			console.info('push.btnUpdate','Clicked');
			app.forceUpdate();
		},
		
		btnDissmiss : function(data) {
			console.info('push.btnDissmiss','Clicked');
		},
	};

appConfig.onInitialize.push(push.onInitialize);
appConfig.onDeviceReady.push(push.onDeviceReady);
appConfig.onWebsiteReady.push(push.sendPushToken);