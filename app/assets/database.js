var classes = require('category');

var rootURL = "http://129.241.110.159/media/";

function initDB(window, displayListView, createEventFunctionCategory, initSearch){


	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function(){
		
	    var json = JSON.parse(this.responseText);
	    if (!json) { 
	        alert('Error - Empty List'); 
	        return;
	    }
	    var jsonCategories = json.categories;
	    var jsonCases = json.cases;
	    var jsonSubCategories = json.subCategories;
	    var jsonBelongsTo = json.belongsTo;
	    var jsonMediaFiles = json.mediaFiles;
	    
	    var rootCategoryID;
	    var categories = {};
	    var categoriesByName = {};
	    for (var i = 0; i < jsonCategories.length; i++) {
	    	if (jsonCategories[i].name == "root") {
	    		rootCategoryID = jsonCategories[i].id;
	    	}
	    	var temp = new classes.category(jsonCategories[i].name, new Array());
	    	categoriesByName[jsonCategories[i].name.toLowerCase()] = temp;
	    	categories[jsonCategories[i].id] = temp;
	    }
	    
	    for (var i = 0; i < jsonSubCategories.length; i++) {
	    	categories[jsonSubCategories[i].superCategory].subCategories.push(categories[jsonSubCategories[i].subCategory]);
	    }
	    
	    var cases = {};
	    for (var i = 0; i < jsonCases.length; i++) {
	    	cases[jsonCases[i].id] = new classes.caseT(jsonCases[i].name, jsonCases[i].description);
	    }
	    
	    for (var i = 0; i < jsonBelongsTo.length; i++) {
	    	categories[jsonBelongsTo[i].category].cases.push(cases[jsonBelongsTo[i].caseT]);
	    }
	    
	    for (var i = 0; i < categories.length; i++) {
	    	Ti.API.info(categories[i].name);
	    	for (var j = 0; j < categories[i].cases.length; j++) {
	    		Ti.API.info(categories[i].cases[j].name);
	    	}
	    }
	    
	    for (var i = 0; i < jsonMediaFiles.length; i++) {
	    	cases[jsonMediaFiles[i].belongsTo].mediaFiles.push(new classes.mediaFile(rootURL + jsonMediaFiles[i].url, jsonMediaFiles[i].video == 1));
	    }
	    
    	var rootCategory = categories[rootCategoryID];
    	rootCategory.name = "Browse";
    	window.setTitle(rootCategory.name);
    	displayListView(window, rootCategory.getSubCategories(), createEventFunctionCategory(rootCategory));
    	initSearch(rootCategory, categoriesByName);
	};
	
	xhr.open('GET', "http://129.241.110.159/database.php");
	
	xhr.send();
	
	
	return true;
}

exports.initDB = initDB;
