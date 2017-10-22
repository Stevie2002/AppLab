'use strict';

var camInstance;

var camConfig = {
		'quality'			: 50,
	};

var cam = {
		setConfig : function(options) {
			camConfig = Object.merge(camConfig,options);
		},
		
		onDeviceReady : function() {
		},
		
		getPicture : function() {
			if(typeof navigator.camera != 'undefined') {
				navigator.camera.getPicture(
					cam.onSuccess,
					cam.onError,
					{
						quality			: camConfig.quality,
						destinationType	: Camera.DestinationType.DATA_URL,
						sourceType		: Camera.PictureSourceType.CAMERA,
						mediaType		: Camera.MediaType.PICTURE,
						cameraDirection	: Camera.Direction.FRONT,
					}
				);
			}
		},
		
		onSuccess : function(imageData) {
			console.success('cam.onSuccess','Loaded');
			
			app.triggerEvent('onPicture',{
				'source'	: imageData,
			});
			
			console.success('','Image/Video sent');
		},
		
		onError : function(event) {
			console.error('cam.onError',event.message);
		},
	};

appConfig.onDeviceReady.push(cam.onDeviceReady);