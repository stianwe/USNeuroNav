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
var db = require('database');
mainCategories = [];
//var names = db.initDB();
//db.initDB();



/*
var subCats = new Array();
var subCatsCat1 = new Array();
var cases = [
	new classes.caseT("Case 1", [
		new classes.mediaFile("http://techslides.com/demos/sample-videos/small.mp4", true, false),
		new classes.mediaFile("http://upload.wikimedia.org/wikipedia/en/e/ec/Lisa_Simpson.png", false, false),
		new classes.mediaFile("http://images.wikia.com/simpsons/images/5/53/Bart_Simpson_Head.PNG", false, false),
		new classes.mediaFile("http://upload.wikimedia.org/wikipedia/en/9/9d/Maggie_Simpson.png", false, false),
	]),
	new classes.caseT("Case 2", new Array()),
	//new classes.caseT("Case 3", new Array()),
	//new classes.caseT("Case 4", new Array()),
];
var oneCat = new classes.category("Frontal Lobe", new Array());
oneCat.cases = cases;

// i made this for test showall.
subCatsCat1[0] = new classes.category("Show All", [oneCat]);
// end

subCatsCat1[1] = new classes.category("Primary Tumors", [
	oneCat,
	new classes.category("Occipital Lobe", new Array()),
	new classes.category("Parietal Lobe", new Array()),
	new classes.category("Random Lobe", new Array()),
	new classes.category("Brain Stem", new Array()),
]);
subCatsCat1[2] = new classes.category("Gliomas", new Array());
subCatsCat1[3] = new classes.category("Meningiomas", new Array());
subCats[0] = new classes.category(names[0], subCatsCat1);
subCats[1] = new classes.category(names[1], new Array());
subCats[2] = new classes.category(names[2], new Array());
var rootCategory = new classes.category("Browse", subCats);

Alloy.Globals.rootCategory = rootCategory;*/