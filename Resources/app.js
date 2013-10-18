var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var classes = require("category");

var db = require("database");

Ti.Gesture.addEventListener("orientationchange", function(e) {
    e.orientation == Titanium.UI.LANDSCAPE_LEFT || e.orientation == Titanium.UI.LANDSCAPE_RIGHT ? Ti.UI.orientation = Titanium.UI.LANDSCAPE_RIGHT : Titanium.UI.orientation = Titanium.UI.PORTRAIT;
});

Alloy.createController("index");