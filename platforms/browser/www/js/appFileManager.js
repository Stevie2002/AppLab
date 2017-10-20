'use strict';

var fileManager;

var fileConfig = {
		'versionUrl' 	: 'https://api.push-pilot.com/version.php',
		'downloadUrl' 	: 'https://api.push-pilot.com/download.php',
		'uploadUrl' 	: 'https://api.push-pilot.com/upload.php',
	};

var file = {
		setConfig : function(options) {
			fileConfig = Object.assign(fileConfig,options);
		},
		
		onInitialize : function() {
		},
		
		onDeviceReady : function() {
			fileManager = new FileTransfer();
			
			console.log('file.onDeviceReady','Loaded');
		},
		
		downloadFromUrl : function(Url) {
			window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function(fs) {
			// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
				console.log('file.downloadFromUrl','Loaded');
				console.log('',fs.name);
				console.log('',Url);
				
				fs.root.getFile('update.apk', { create: true, exclusive: false }, function(fileEntry) {
					// file.download(fileEntry, Url, true);
					// console.log('',cordova.file.applicationDirectory+'www/test.js');
					// console.log('',cordova.file.externalDataDirectory+'beep.wav');
					
					var fileURL = fileEntry.toURL();
					
					fileManager.download(
						Url,
						fileURL,
						function(entry) {
							file.update(entry.toURL());
							// website.src = entry.toURL();
							console.log("download complete: " + entry.toURL());
						},
						function(error) {
							console.log("download error source " + error.source);
							console.log("download error target " + error.target);
							console.log("download error code" + error.code);
						},
						true
					);
					
				}, file.onErrorCreateFile);
			}, file.onErrorLoadFs);
			
			console.log('','Complete');
		},
		
		download : function() {
			console.error('file.downloadFromUrl','Error');
		},
		
		onErrorLoadFs : function() {
			console.error('file.downloadFromUrl','Error');
		},
		
		onErrorCreateFile : function() {
			console.success('file.downloadFromUrl','Success');
		},
	};
	
appConfig.onDeviceReady.push(file.onDeviceReady);
/*	
var uri = encodeURI(fileConfig.downloadUrl);
 
fileTransfer.download(
    uri,
    fileURL,
    function(entry) {
        console.log("download complete: " + entry.toURL());
    },
    function(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
    },
    false,
    {
        headers: {
            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        }
    }
);
*/