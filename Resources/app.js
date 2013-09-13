var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var classes = require("category");

var subCats = new Array();

var subCatsCat1 = new Array();

subCatsCat1[0] = new classes.category("Cat1Subcat1", [ new classes.category("One", new Array()), new classes.category("Two", new Array()), new classes.category("Three", new Array()), new classes.category("Four", new Array()), new classes.category("Five", new Array()) ]);

subCatsCat1[1] = new classes.category("Cat1Subcat2", new Array());

subCatsCat1[2] = new classes.category("Cat1Subcat3", new Array());

subCats[0] = new classes.category("cat1", subCatsCat1);

subCats[1] = new classes.category("cat2", new Array());

subCats[2] = new classes.category("cat3", new Array());

var rootCategory = new classes.category("Root", subCats);

Alloy.Globals.rootCategory = rootCategory;

Alloy.createController("index");