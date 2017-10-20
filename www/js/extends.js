Object.merge = function(object1,object2) {
	var object1 = object1 || {},
		object2 = object2 || {},
		objectR = {};
	
	jQuery.extend(true,objectR,object1,object2);
	
    return objectR;
};