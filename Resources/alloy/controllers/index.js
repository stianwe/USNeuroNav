function Controller() {
    function displayListView(window, items, eventFunction, caseT) {
        var listView = Ti.UI.createListView();
        var section = Ti.UI.createListSection();
        var sections = [];
        if (null != caseT) {
            var section2 = Ti.UI.createListSection();
            section2.setItems([ {
                properties: {
                    title: caseT.description
                }
            } ]);
            sections.push(section2);
        }
        section.setItems(items);
        sections.push(section);
        listView.sections = sections;
        listView.addEventListener("itemclick", eventFunction);
        window.addEventListener("close", function() {
            currentCategories.pop();
        });
        window.add(listView);
    }
    function viewCases(nextWindow, categories, tab) {
        var cases = categories[0].cases.slice();
        var casesToPrint = categories[0].cases.slice();
        for (var i = 1; categories.length > i; i++) {
            if ("*" == categories[i].name) continue;
            for (var j = 0; cases.length > j; j++) {
                var index = categories[i].cases.indexOf(cases[j]);
                -1 == index && casesToPrint.splice(casesToPrint.indexOf(cases[j]), 1);
            }
            cases = casesToPrint.slice();
        }
        var toBeRemoved = [];
        var props = [];
        for (var i = 0; casesToPrint.length > i; i++) {
            "Case 1" == casesToPrint[i].name && alert("Logged in? " + isLoggedIn + ", public? " + casesToPrint[i].publicT);
            if (!isLoggedIn && !casesToPrint[i].publicT) {
                toBeRemoved.push(i);
                continue;
            }
            props.push({
                properties: {
                    title: casesToPrint[i].name
                }
            });
        }
        for (var i = 0; toBeRemoved.length > i; i++) casesToPrint.splice(toBeRemoved[i], 1);
        displayListView(nextWindow, props, createEventFunctionCase(casesToPrint, tab));
    }
    function createEventFunctionCategory(currentCategory) {
        return function(e) {
            if (0 == e.itemIndex && currentCategories.length > 0) {
                currentCategories.push(new classes.category("*", new Array()));
                var nextWindow = Ti.UI.createWindow({
                    title: "Show all",
                    backgroundColor: "#fff"
                });
                viewCases(nextWindow, currentCategories, $.tab1);
            } else {
                var index = e.itemIndex;
                currentCategories.length > 0 && index--;
                var currCat = currentCategory.subCategories[index];
                currentCategories.push(currCat);
                var nextWindow = Ti.UI.createWindow({
                    title: currCat.name,
                    backgroundColor: "#fff"
                });
                if (currCat.subCategories.length > 0) {
                    var subCats = currCat.getSubCategories();
                    subCats.unshift({
                        properties: {
                            title: "Show all"
                        }
                    });
                    displayListView(nextWindow, subCats, createEventFunctionCategory(currCat));
                } else currCat.cases.length > 0 ? viewCases(nextWindow, currentCategories, $.tab1) : nextWindow.addEventListener("close", function() {
                    currentCategories.pop();
                });
            }
            $.tab1.open(nextWindow);
        };
    }
    function createEventFunctionCase(cases, tab) {
        return function(e) {
            var currentCase = cases[e.itemIndex];
            var nextWindow = Ti.UI.createWindow({
                title: currentCase.name,
                backgroundColor: "#fff"
            });
            var objects = [ {
                properties: {
                    title: currentCase.description
                }
            }, {
                properties: {
                    title: "Videos"
                }
            }, {
                properties: {
                    title: "Images"
                }
            } ];
            currentCategories.push(null);
            displayListView(nextWindow, objects, createMediaFunctionCase(currentCase, tab));
            tab.open(nextWindow);
        };
    }
    function createMediaFunctionCase(currentCase, tab) {
        return function(e) {
            if (0 == e.itemIndex) return;
            var videos = 1 == e.itemIndex;
            var nextWindow = Ti.UI.createWindow({
                title: currentCase.name,
                backgroundColor: "#fff"
            });
            var views = [];
            for (var i = 0; currentCase.mediaFiles.length > i; i++) {
                var view = null;
                var initialZoom;
                var wrapper = Ti.UI.createScrollView({
                    maxZoomScale: 8,
                    backgroundColor: "black"
                });
                if (currentCase.mediaFiles[i].video && videos) {
                    view = Ti.Media.createVideoPlayer({
                        autoplay: false,
                        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
                        scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                        url: currentCase.mediaFiles[i].URL
                    });
                    initialZoom = 1;
                } else if (!currentCase.mediaFiles[i].video && !videos) {
                    view = Ti.UI.createImageView({
                        image: currentCase.mediaFiles[i].URL
                    });
                    var temp1 = (Titanium.Platform.displayCaps.platformWidth - 123) / view.toImage().height;
                    var temp2 = (Titanium.Platform.displayCaps.platformHeight - 123) / view.toImage().height;
                    initialZoom = temp2 > temp1 ? temp1 : temp2;
                }
                if (null != view) {
                    wrapper.minZoomScale = initialZoom;
                    wrapper.zoomScale = initialZoom;
                    wrapper.add(view);
                    views.push(wrapper);
                }
            }
            var scrollableView = Ti.UI.createScrollableView({
                views: views,
                backgroundColor: "#000",
                showPagingControl: true
            });
            nextWindow.add(scrollableView);
            tab.open(nextWindow);
        };
    }
    function initSearch(rootCategory, categories) {
        var searchButton = Titanium.UI.createButton({
            title: "Search",
            top: 125,
            width: 100,
            height: 50
        });
        var search = function() {
            searchArea.blur();
            if ("" == searchArea.getValue()) {
                alert("Please type a keyword!");
                return;
            }
            var keywords = searchArea.getValue().split(",");
            var cats = [];
            for (var i = 0; keywords.length > i; i++) {
                keywords[i] = keywords[i].trim().toLowerCase();
                var temp = categories[keywords[i]];
                void 0 != temp ? cats.push(temp) : alert("Invalid keyword: " + keywords[i] + "!");
            }
            if (0 == cats.length) {
                alert("No valid keywords!");
                return;
            }
            var nextWindow = Ti.UI.createWindow({
                title: "Search results",
                backgroundColor: "#fff"
            });
            viewCases(nextWindow, cats, $.tab2);
            $.tab2.open(nextWindow);
        };
        searchArea.addEventListener("return", search);
        searchButton.addEventListener("click", search);
        $.tab2window1.add(searchArea);
        $.tab2window1.add(searchButton);
    }
    function login(username, password) {
        var req = Titanium.Network.createHTTPClient();
        req.onload = function() {
            var json = JSON.parse(this.responseText);
            if ("1" == json.response) {
                isLoggedIn = true;
                initLogout();
            } else alert("Login failed!");
        };
        req.onerror = function() {
            alert("Something went wrong!");
        };
        req.open("GET", db.address + "/login.php?username=" + username + "&password=" + password);
        req.send();
    }
    function initLogout() {
        if (null == logoutView) {
            logoutView = Titanium.UI.createView();
            var logoutButton = Titanium.UI.createButton({
                title: "Log out",
                top: 50,
                width: 100,
                height: 50
            });
            logoutButton.addEventListener("click", function() {
                isLoggedIn = false;
                initLogin();
            });
            logoutView.add(logoutButton);
            $.tab3window1.add(logoutView);
        }
        loginView.setVisible(false);
        logoutView.setVisible(true);
    }
    function initLogin() {
        if (null == loginView) {
            loginView = Titanium.UI.createView();
            var usernameField = Titanium.UI.createTextField({
                top: 10,
                left: 10,
                right: 10,
                hintText: "Username",
                borderWidth: 1,
                borderColor: "#aaa",
                borderRadius: 10,
                height: 35
            });
            var passwordField = Titanium.UI.createTextField({
                hintText: "Password",
                borderWidth: 1,
                borderColor: "#aaa",
                borderRadius: 10,
                passwordMask: true,
                height: 35,
                left: 10,
                right: 10,
                top: 55
            });
            var button = Titanium.UI.createButton({
                title: "Log in",
                top: 120,
                width: 100,
                height: 50
            });
            var loginHelper = function() {
                usernameField.blur();
                passwordField.blur();
                login(usernameField.value, passwordField.value);
            };
            button.addEventListener("click", loginHelper);
            passwordField.addEventListener("return", loginHelper);
            usernameField.addEventListener("return", loginHelper);
            loginView.add(usernameField);
            loginView.add(passwordField);
            loginView.add(button);
            $.tab3window1.add(loginView);
        } else logoutView.setVisible(false);
        loginView.setVisible(true);
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
    $.__views.tab2window1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Search",
        id: "tab2window1"
    });
    $.__views.tab2 = Ti.UI.createTab({
        window: $.__views.tab2window1,
        title: "Search",
        icon: "KS_nav_views.png",
        id: "tab2"
    });
    $.__views.index.addTab($.__views.tab2);
    $.__views.tab3window1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Log in",
        id: "tab3window1"
    });
    $.__views.tab3 = Ti.UI.createTab({
        window: $.__views.tab3window1,
        title: "Log in",
        icon: "KS_nav_views.png",
        id: "tab3"
    });
    $.__views.index.addTab($.__views.tab3);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var currentCategories = [];
    var isLoggedIn = false;
    var searchArea = Ti.UI.createTextArea({
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 10,
        top: 10,
        left: 10,
        right: 10,
        height: 100,
        font: {
            fontSize: 20,
            fontWeight: "bold"
        },
        returnKeyType: Ti.UI.RETURNKEY_SEARCH
    });
    var loginView = null;
    var logoutView = null;
    initLogin();
    db.initDB($.tab1window1, displayListView, createEventFunctionCategory, initSearch);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;