'use strict';

var geoInstance;

var geoConfig = {
		'watch'		: false,
		'maximumAge': 3000,
		'timeout'	: 5000,
		'accuracy'	: true,
	};

var geo = {
		setConfig : function(options) {
			geoConfig = Object.merge(geoConfig,options);
		},
		
		onDeviceReady : function() {
			if(geoConfig.watch) {
				geo.startWatching();
			}
		},
		
		getPosition : function() {
			if(typeof navigator.geolocation != 'undefined') {
				navigator.geolocation.getCurrentPosition(
					geo.onSuccess,
					geo.onError,
					{
						maximumAge			: geoConfig.maximumAge,
						timeout				: geoConfig.timeout,
						enableHighAccuracy	: geoConfig.accuracy,
					}
				);
			}
		},
		
		startWatching : function(event) {
			if(typeof navigator.geolocation != 'undefined') {
				geoInstance = navigator.geolocation.watchPosition(
					geo.onSuccess,
					geo.onError,
					{
						maximumAge			: geoConfig.maximumAge,
						timeout				: geoConfig.timeout,
						enableHighAccuracy	: geoConfig.accuracy,
					}
				);
				
				console.success('geo.onDeviceReady','Geo Watch started');
			}
		},
		
		stopWatching : function(event) {
			if(typeof navigator.geolocation != 'undefined') {
				navigator.geolocation.clearWatch(geoInstance);
				console.success('geo.onDeviceReady','Geo Watch stopped');
			}
		},
		
		onSuccess : function(position) {
			if(position.length) {
				console.success('geo.onSuccess','Loaded');
				
				console.log(JSON.stringify(position));
				app.triggerEvent('onLocation',position);
				
				console.success('','Position sent');
			}
		},
		
		onError : function(event) {
			console.error('geo.onError',event.message);
		},
	};

appConfig.onDeviceReady.push(geo.onDeviceReady);