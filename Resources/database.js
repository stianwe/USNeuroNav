function initDB(window, displayListView, createEventFunctionCategory, initSearch) {
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
        var categoriesByName = {};
        for (var i = 0; jsonCategories.length > i; i++) {
            "root" == jsonCategories[i].name && (rootCategoryID = jsonCategories[i].id);
            var temp = new classes.category(jsonCategories[i].name, new Array());
            categoriesByName[jsonCategories[i].name.toLowerCase()] = temp;
            categories[jsonCategories[i].id] = temp;
        }
        for (var i = 0; jsonSubCategories.length > i; i++) categories[jsonSubCategories[i].superCategory].subCategories.push(categories[jsonSubCategories[i].subCategory]);
        var cases = {};
        for (var i = 0; jsonCases.length > i; i++) cases[jsonCases[i].id] = new classes.caseT(jsonCases[i].name, jsonCases[i].description, "1" == jsonCases[i].publicT);
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
        initSearch(rootCategory, categoriesByName);
    };
    xhr.open("GET", address + "/database.php");
    xhr.send();
    return true;
}

var classes = require("category");

var address = "http://129.241.110.159";

var rootURL = address + "/media/";

exports.initDB = initDB;

exports.address = address;