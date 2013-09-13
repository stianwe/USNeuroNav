// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Make the "functions" in category.js available
var classes = require('category');

var subCats = new Array();
var subCatsCat1 = new Array();
subCatsCat1[0] = new classes.category("Cat1Subcat1", [
	new classes.category("One", new Array()),
	new classes.category("Two", new Array()),
	new classes.category("Three", new Array()),
	new classes.category("Four", new Array()),
	new classes.category("Five", new Array()),
]);
subCatsCat1[1] = new classes.category("Cat1Subcat2", new Array());
subCatsCat1[2] = new classes.category("Cat1Subcat3", new Array());
subCats[0] = new classes.category("cat1", subCatsCat1);
subCats[1] = new classes.category("cat2", new Array());
subCats[2] = new classes.category("cat3", new Array());
var rootCategory = new classes.category("Root", subCats);

Alloy.Globals.rootCategory = rootCategory;