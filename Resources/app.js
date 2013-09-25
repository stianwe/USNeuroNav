var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var classes = require("category");

var subCats = new Array();

var subCatsCat1 = new Array();

var cases = [ new classes.caseT("Case 1", [ new classes.mediaFile("http://techslides.com/demos/sample-videos/small.mp4", true, false), new classes.mediaFile("http://upload.wikimedia.org/wikipedia/en/e/ec/Lisa_Simpson.png", false, false), new classes.mediaFile("http://images.wikia.com/simpsons/images/5/53/Bart_Simpson_Head.PNG", false, false), new classes.mediaFile("http://upload.wikimedia.org/wikipedia/en/9/9d/Maggie_Simpson.png", false, false) ]), new classes.caseT("Case 2", new Array()) ];

var oneCat = new classes.category("Frontal Lobe", new Array());

oneCat.cases = cases;

subCatsCat1[0] = new classes.category("Show All", [ oneCat ]);

subCatsCat1[1] = new classes.category("Primary Tumors", [ oneCat, new classes.category("Occipital Lobe", new Array()), new classes.category("Parietal Lobe", new Array()), new classes.category("Random Lobe", new Array()), new classes.category("Brain Stem", new Array()) ]);

subCatsCat1[2] = new classes.category("Gliomas", new Array());

subCatsCat1[3] = new classes.category("Meningiomas", new Array());

subCats[0] = new classes.category("Tumors", subCatsCat1);

subCats[1] = new classes.category("Cranial Vascular", new Array());

subCats[2] = new classes.category("Spine", new Array());

var rootCategory = new classes.category("Browse", subCats);

Alloy.Globals.rootCategory = rootCategory;

Alloy.createController("index");