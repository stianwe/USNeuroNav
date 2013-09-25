function initDB(window, displayListView, createEventFunctionCategory) {
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function() {
        var json = JSON.parse(this.responseText);
        if (!json) {
            alert("Error - Empty List");
            return;
        }
        var jsonCategories = json.categories;
        var jsonCases = json.cases;
        var jsonSubCategories = json.subCategories;
        var jsonBelongsTo = json.belongsTo;
        var jsonMediaFiles = json.mediaFiles;
        var rootCategoryID;
        var categories = {};
        for (var i = 0; jsonCategories.length > i; i++) {
            "root" == jsonCategories[i].name && (rootCategoryID = jsonCategories[i].id);
            categories[jsonCategories[i].id] = new classes.category(jsonCategories[i].name, new Array());
        }
        for (var i = 0; jsonSubCategories.length > i; i++) categories[jsonSubCategories[i].superCategory].subCategories.push(categories[jsonSubCategories[i].subCategory]);
        var cases = {};
        for (var i = 0; jsonCases.length > i; i++) cases[jsonCases[i].id] = new classes.caseT(jsonCases[i].name);
        for (var i = 0; jsonBelongsTo.length > i; i++) categories[jsonBelongsTo[i].category].cases.push(cases[jsonBelongsTo[i].caseT]);
        for (var i = 0; categories.length > i; i++) {
            Ti.API.info(categories[i].name);
            for (var j = 0; categories[i].cases.length > j; j++) Ti.API.info(categories[i].cases[j].name);
        }
        for (var i = 0; jsonMediaFiles.length > i; i++) cases[jsonMediaFiles[i].belongsTo].mediaFiles.push(new classes.mediaFile(rootURL + jsonMediaFiles[i].url, 1 == jsonMediaFiles[i].video));
        var rootCategory = categories[rootCategoryID];
        rootCategory.name = "Browse";
        window.setTitle(rootCategory.name);
        displayListView(window, rootCategory.getSubCategories(), createEventFunctionCategory(rootCategory));
    };
    xhr.open("GET", "http://129.241.110.159/database.php");
    xhr.send();
    return true;
}

var classes = require("category");

var rootURL = "http://129.241.110.159/media/";

exports.initDB = initDB;