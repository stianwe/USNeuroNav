var classes = require('category');

function initDB(window, displayListView, createEventFunctionCategory){


	var xhr = Titanium.Network.createHTTPClient();
	
	
	
	xhr.onload = function(){
		
		//alert(this.responseText);
		
		
	    var json = JSON.parse(this.responseText);
	    if (!json) { 
	        alert('Error - Empty List'); 
	        return;
	    }
	    var jsonCategories = json.categories;
	    
	    for(var pos=0; pos < jsonCategories.length; pos++){
     		mainCategories[pos] = jsonCategories[pos].name;
    	}
    	
    	var subCats = new Array();
    	for (var i = 0; i < mainCategories.length; i++) {
    		subCats[i] = new classes.category(mainCategories[i], new Array());
    	}
    	var rootCategory = new classes.category("Root", subCats);
    	window.setTitle(rootCategory.name);
    	displayListView(window, rootCategory.getSubCategories(), createEventFunctionCategory(rootCategory));
	};
	
	xhr.open('GET', "http://129.241.110.159/database.php");
	
	xhr.send();
	
	
	return true;
}

exports.initDB = initDB;
