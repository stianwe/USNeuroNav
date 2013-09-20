function initDB(){


	var xhr = Titanium.Network.createHTTPClient();
	var mainCategories = [];
	xhr.open('GET', "129.241.110.159/database.php");
	xhr.send();
	
	xhr.onload = function(){
	    var json = JSON.parse(this.responseText);
	    if (!json) { 
	        Titanium.API.info('Error - Empty List'); 
	        return;
	    }
	    var json = json.category;
	    var pos;
	   	for( pos=0; pos < jsoncats.length; pos++){
     	   mainCategories[pos] = Ti.UI.info(json[pos].name);
    	}
	};
	
	return mainCategories;
}

exports.initDB = initDB;
