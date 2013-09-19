var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var classes = require("category");

var subCats = new Array();

var subCatsCat1 = new Array();

var cases = [ new classes.caseT("Case 1", [ new classes.mediaFile("http://techslides.com/demos/sample-videos/small.mp4", true, false), new classes.mediaFile("http://upload.wikimedia.org/wikipedia/en/e/ec/Lisa_Simpson.png", false, false), new classes.mediaFile("http://images.wikia.com/simpsons/images/5/53/Bart_Simpson_Head.PNG", false, false), new classes.mediaFile("http://upload.wikimedia.org/wikipedia/en/9/9d/Maggie_Simpson.png", false, false) ]), new classes.caseT("Case 2", new Array()), new classes.caseT("Case 3", new Array()), new classes.caseT("Case 4", new Array()) ];

var oneCat = new classes.category("One", new Array());

oneCat.cases = cases;

subCatsCat1[0] = new classes.category("Cat1Subcat1", [ oneCat, new classes.category("Two", new Array()), new classes.category("Three", new Array()), new classes.category("Four", new Array()), new classes.category("Five", new Array()) ]);

subCatsCat1[1] = new classes.category("Cat1Subcat2", new Array());

subCatsCat1[2] = new classes.category("Cat1Subcat3", new Array());

subCats[0] = new classes.category("cat1", subCatsCat1);

subCats[1] = new classes.category("cat2", new Array());

subCats[2] = new classes.category("cat3", new Array());

var rootCategory = new classes.category("Root", subCats);

Alloy.Globals.rootCategory = rootCategory;

Alloy.createController("index");