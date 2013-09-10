function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.l1 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "Heyo",
        id: "l1"
    });
    $.__views.index.add($.__views.l1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    var vidWin = Titanium.UI.createWindow({
        title: "Video View Demo",
        backgroundColor: "#fff"
    });
    var videoPlayer = Titanium.Media.createVideoPlayer({
        top: 2,
        autoplay: true,
        backgroundColor: "blue",
        height: 300,
        width: 300,
        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
        scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT
    });
    videoPlayer.url = "http://192.168.0.104/app/short.mp4";
    vidWin.add(videoPlayer);
    vidWin.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;