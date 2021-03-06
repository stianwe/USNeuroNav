function Controller() {
    function displayListView(window, items, eventFunction, caseT) {
        var listView = Ti.UI.createListView({});
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
            currentCategories.length > 1 && currentCategories.pop();
        });
        window.add(listView);
    }
    function getCommonCases(categories) {
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
        return casesToPrint;
    }
    function viewCases(nextWindow, categories, tab) {
        var casesToPrint = getCommonCases(categories);
        var toBeRemoved = [];
        var props = [];
        for (var i = 0; casesToPrint.length > i; i++) {
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
    function getCategoriesToShow(category) {
        var subCats = category.subCategories;
        var catsToShow = [];
        for (var i = 0; subCats.length > i; i++) {
            var tempCats = currentCategories.slice();
            tempCats.push(subCats[i]);
            var temp = getCommonCases(tempCats);
            if (temp.length > 0) {
                var show = false;
                for (var j = 0; temp.length > j; j++) (isLoggedIn || temp[j].publicT) && (show = true);
                show && catsToShow.push(subCats[i]);
            }
        }
        return catsToShow;
    }
    function displayNonEmptyCategories(currCat, nextWindow) {
        var catsToShow = getCategoriesToShow(currCat);
        var catObjs = [];
        catObjs.unshift({
            properties: {
                title: "Show all"
            }
        });
        for (var i = 0; catsToShow.length > i; i++) catObjs.push({
            properties: {
                title: catsToShow[i].name
            }
        });
        displayListView(nextWindow, catObjs, createEventFunctionCategory(currCat, catsToShow));
    }
    function createEventFunctionCategory(currentCategory, subCategories) {
        return function(e) {
            if (0 == e.itemIndex) {
                currentCategories.push(new classes.category("*", new Array()));
                var nextWindow = Ti.UI.createWindow({
                    title: "Show all",
                    backgroundColor: "#fff"
                });
                viewCases(nextWindow, currentCategories, $.tab1);
            } else {
                var index = e.itemIndex;
                index--;
                var currCat = subCategories[index];
                currentCategories.push(currCat);
                var nextWindow = Ti.UI.createWindow({
                    title: currCat.name,
                    backgroundColor: "#fff"
                });
                currCat.subCategories.length > 0 ? displayNonEmptyCategories(currCat, nextWindow) : currCat.cases.length > 0 ? viewCases(nextWindow, currentCategories, $.tab1) : nextWindow.addEventListener("close", function() {
                    currentCategories.pop();
                });
            }
            $.tab1.open(nextWindow);
        };
    }
    function createEventFunctionCase(cases, tab) {
        return function(e) {
            var view = Ti.UI.createView({
                borderWidth: 1,
                layout: "vertical",
                height: Ti.UI.SIZE
            });
            var currentCase = cases[e.itemIndex];
            var nextWindow = Ti.UI.createWindow({
                title: currentCase.name,
                backgroundColor: "#fff",
                layout: "vertical"
            });
            var objects = [];
            currentCase.hasVideo() && objects.push({
                properties: {
                    title: "Videos"
                }
            });
            currentCase.hasImage() && objects.push({
                properties: {
                    title: "Images"
                }
            });
            tab == $.tab1 && currentCategories.push(null);
            var descLabel = Titanium.UI.createLabel({
                text: "Description:",
                font: {
                    fontWeight: "bold",
                    fontsize: 48
                },
                color: "#777",
                textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
            });
            var label = Titanium.UI.createLabel({
                text: currentCase.publicDescription + (isLoggedIn ? "\n\n" + currentCase.privateDescription : ""),
                left: 4,
                right: 4,
                color: "#777",
                font: {
                    fontsize: 48
                },
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
            });
            view.add(descLabel);
            view.add(label);
            activityIndicator = uie.createIndicatorWindow();
            nextWindow.add(view);
            displayListView(nextWindow, objects, createMediaFunctionCase(nextWindow, currentCase, tab, activityIndicator));
            tab.open(nextWindow);
        };
    }
    function createMediaFunctionCase(oldWindow, currentCase, tab, activityIndicator) {
        return function(e) {
            if (!networkCheck()) return;
            activityIndicator.openIndicator();
            var videos = 0 == e.itemIndex && currentCase.hasVideo();
            var nextWindow = Ti.UI.createWindow({
                title: currentCase.name,
                backgroundColor: "#fff"
            });
            var scrollableView;
            if (lastImagesName != currentCase.name || videos) {
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
                        var temp1, temp2;
                        view.toImage();
                        var height = 1e3 > view.toImage().height ? 1153 : view.toImage().height;
                        var width = 1e3 > view.toImage().width ? 1919 : view.toImage().width;
                        if ("ipad" == Titanium.Platform.osname) if (Titanium.Platform.displayCaps.platformHeight > Titanium.Platform.displayCaps.platformWidth) {
                            temp1 = Titanium.Platform.displayCaps.platformWidth / width;
                            temp2 = Titanium.Platform.displayCaps.platformHeight / width;
                        } else {
                            temp1 = .74375 * Titanium.Platform.displayCaps.platformWidth / height;
                            temp2 = .74375 * Titanium.Platform.displayCaps.platformHeight / height;
                        } else if (Titanium.Platform.displayCaps.platformHeight > Titanium.Platform.displayCaps.platformWidth) {
                            temp1 = Titanium.Platform.displayCaps.platformWidth / width;
                            temp2 = Titanium.Platform.displayCaps.platformHeight / width;
                        } else {
                            temp1 = (Titanium.Platform.displayCaps.platformWidth - 128) / height;
                            temp2 = (Titanium.Platform.displayCaps.platformHeight - 128) / height;
                        }
                        initialZoom = temp2 > temp1 ? temp1 : temp2;
                    }
                    if (null != view) {
                        wrapper.minZoomScale = initialZoom;
                        wrapper.zoomScale = initialZoom;
                        wrapper.add(view);
                        views.push(wrapper);
                    }
                }
                scrollableView = Ti.UI.createScrollableView({
                    views: views,
                    backgroundColor: "#000",
                    showPagingControl: true
                });
                if (videos) {
                    var pauseVideos = function() {
                        for (var i = 0; views.length > i; i++) views[i].children[0].pause();
                    };
                    nextWindow.addEventListener("close", function() {
                        pauseVideos();
                        stopVideoFunctions = [];
                    });
                    stopVideoFunctions.push(pauseVideos);
                } else {
                    lastImages = scrollableView;
                    lastImagesName = currentCase.name;
                }
            } else scrollableView = lastImages;
            nextWindow.add(scrollableView);
            tab.open(nextWindow);
            activityIndicator.closeIndicator();
        };
    }
    function initSearch(rootCategory, categories) {
        var searchButton = Titanium.UI.createButton({
            title: "Search",
            top: 150,
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
            if (0 == cats.length) return;
            var nextWindow = Ti.UI.createWindow({
                title: "Search results",
                backgroundColor: "#fff"
            });
            viewCases(nextWindow, cats, $.tab2);
            $.tab2.open(nextWindow);
        };
        searchArea.addEventListener("return", search);
        searchButton.addEventListener("click", search);
        var helpLabel = Ti.UI.createLabel({
            text: "Enter keywords separated by comma",
            top: 10
        });
        $.tab2window1.add(searchArea);
        $.tab2window1.add(helpLabel);
        $.tab2window1.add(searchButton);
    }
    function login(username, password) {
        var req = Titanium.Network.createHTTPClient();
        req.onload = function() {
            var json = JSON.parse(this.responseText);
            if ("1" == json.response) {
                isLoggedIn = true;
                initLogout();
                initBrowse();
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
            var helpLabel = Ti.UI.createLabel({
                text: "You are now logged in!",
                top: 10
            });
            var logoutButton = Titanium.UI.createButton({
                title: "Log out",
                top: 70,
                width: 100,
                height: 50
            });
            logoutButton.addEventListener("click", function() {
                isLoggedIn = false;
                initLogin();
                initBrowse();
            });
            logoutView.add(logoutButton);
            logoutView.add(helpLabel);
            $.tab3window1.add(logoutView);
        }
        loginView.setVisible(false);
        logoutView.setVisible(true);
    }
    function initLogin() {
        if (null == loginView || null == logoutView) {
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
                if (!networkCheck()) return;
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
    function initBrowse() {
        currentCategories = [ db.rootCategory ];
        displayNonEmptyCategories(db.rootCategory, $.tab1window1);
        $.index.addEventListener("focus", function() {
            for (var i = 0; stopVideoFunctions.length > i; i++) stopVideoFunctions[i]();
        });
    }
    function networkCheck() {
        if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
            Titanium.UI.createAlertDialog({
                title: "WARNING!",
                message: "Your device is not connected to the Internet.",
                buttonName: "OK"
            }).show();
            return false;
        }
        return true;
    }
    function main() {
        if (networkCheck()) {
            initLogin();
            db.initDB(displayListView, createEventFunctionCategory, initSearch, currentCategories, initBrowse);
            $.index.open();
        } else createNetworkErrorView();
    }
    function createNetworkErrorView() {
        var window = Ti.UI.createWindow({
            title: "Network error",
            backgroundColor: "#fff"
        });
        window.add(Ti.UI.createLabel({
            text: "This application requires an active internet connection to run.",
            top: 120
        }));
        var button = Ti.UI.createButton({
            title: "Retry",
            top: 160
        });
        button.addEventListener("click", main);
        window.add(button);
        window.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId0 = [];
    $.__views.tab1window1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Browse",
        id: "tab1window1"
    });
    $.__views.tab1 = Ti.UI.createTab({
        window: $.__views.tab1window1,
        title: "Browse",
        icon: "KS_nav_ui.png",
        id: "tab1"
    });
    __alloyId0.push($.__views.tab1);
    $.__views.tab2window1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Search",
        id: "tab2window1"
    });
    $.__views.tab2 = Ti.UI.createTab({
        window: $.__views.tab2window1,
        title: "Search",
        icon: "searchicon.png",
        id: "tab2"
    });
    __alloyId0.push($.__views.tab2);
    $.__views.tab3window1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Log in",
        id: "tab3window1"
    });
    $.__views.tab3 = Ti.UI.createTab({
        window: $.__views.tab3window1,
        title: "Log in",
        icon: "loginicon.png",
        id: "tab3"
    });
    __alloyId0.push($.__views.tab3);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var currentCategories = [];
    var isLoggedIn = false;
    var stopVideoFunctions = [];
    var lastImages = null;
    var lastImagesName = "";
    var searchArea = Ti.UI.createTextArea({
        borderWidth: 1,
        hintText: "Keywords separated by comma",
        borderColor: "#aaa",
        borderRadius: 10,
        top: 40,
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
    main();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;