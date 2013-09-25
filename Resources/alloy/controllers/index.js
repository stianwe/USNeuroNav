function Controller() {
    function displayListView(window, items, eventFunction) {
        var listView = Ti.UI.createListView();
        var section = Ti.UI.createListSection();
        var sections = [];
        section.setItems(items);
        sections.push(section);
        listView.sections = sections;
        listView.addEventListener("itemclick", eventFunction);
        window.addEventListener("close", function() {
            currentCategories.pop();
        });
        window.add(listView);
    }
    function createEventFunctionCategory(currentCategory) {
        return function(e) {
            var currCat = currentCategory.subCategories[e.itemIndex];
            currentCategories.push(currCat);
            var nextWindow = Ti.UI.createWindow({
                title: currCat.name,
                backgroundColor: "#fff"
            });
            if (currCat.subCategories.length > 0) displayListView(nextWindow, currCat.getSubCategories(), createEventFunctionCategory(currCat)); else if (currCat.cases.length > 0) {
                var cases = currentCategories[0].cases.slice();
                for (var i = 0; currentCategories.length > i; i++) for (var j = 0; cases.length > j; j++) {
                    var index = currentCategories[i].cases.indexOf(cases[j]);
                    -1 == index && cases.splice(cases.indexOf(cases[j]), 1);
                }
                var props = [];
                for (var i = 0; cases.length > i; i++) props[i] = {
                    properties: {
                        title: cases[i].name
                    }
                };
                displayListView(nextWindow, props, createEventFunctionCase(cases));
            } else nextWindow.addEventListener("close", function() {
                currentCategories.pop();
            });
            $.tab1.open(nextWindow);
        };
    }
    function createEventFunctionCase(cases) {
        return function(e) {
            var currentCase = cases[e.itemIndex];
            var nextWindow = Ti.UI.createWindow({
                title: currentCase.name,
                backgroundColor: "#fff"
            });
            var views = [];
            for (var i = 0; currentCase.mediaFiles.length > i; i++) {
                var view;
                view = currentCase.mediaFiles[i].video ? Ti.Media.createVideoPlayer({
                    autoplay: false,
                    mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
                    scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                    url: currentCase.mediaFiles[i].URL
                }) : Ti.UI.createImageView({
                    image: currentCase.mediaFiles[i].URL
                });
                views[i] = view;
            }
            var scrollableView = Ti.UI.createScrollableView({
                views: views,
                showPagingControl: true
            });
            nextWindow.add(scrollableView);
            $.tab1.open(nextWindow);
        };
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.tab1window1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Tab 1",
        id: "tab1window1"
    });
    $.__views.tab1 = Ti.UI.createTab({
        window: $.__views.tab1window1,
        title: "Browse",
        icon: "KS_nav_ui.png",
        id: "tab1"
    });
    $.__views.index.addTab($.__views.tab1);
    $.__views.__alloyId2 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Tab 2",
        id: "__alloyId2"
    });
    $.__views.__alloyId3 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 2",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "Search",
        icon: "KS_nav_views.png",
        id: "__alloyId1"
    });
    $.__views.index.addTab($.__views.__alloyId1);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var currentCategories = [];
    db.initDB($.tab1window1, displayListView, createEventFunctionCategory);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;