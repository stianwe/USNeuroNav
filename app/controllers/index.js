var currentCategories = [];
var isLoggedIn = false;

function displayListView(window, items, eventFunction, caseT) {
	var listView = Ti.UI.createListView({
		//borderRadius: 0,
		//borderWidth: 1,
	});
	var section = Ti.UI.createListSection();
	var sections = [];
	if (caseT != null) {
		var section2 = Ti.UI.createListSection();
		section2.setItems([{properties: {title:caseT.description}}]);
		sections.push(section2);
	}
	section.setItems(items);
	sections.push(section);
	listView.sections = sections;
	listView.addEventListener('itemclick', eventFunction);
	window.addEventListener('close', function(e) {
		if (currentCategories.length > 1) {
			currentCategories.pop();
		}
	});
	
	window.add(listView);
	/*var names = [];
	for (var i = 0; i < currentCategories.length; i++) {
		names[i] = currentCategories[i].name;
	}
	alert(names);*/
}

function getCommonCases(categories) {
	var cases = categories[0].cases.slice();
	var casesToPrint = categories[0].cases.slice();
	for (var i = 1; i < categories.length; i++) {
		if (categories[i].name == "*") {
			continue;
		}
		for (var j = 0; j < cases.length; j++) {
			var index = categories[i].cases.indexOf(cases[j]);
			if (index == -1) {
				casesToPrint.splice(casesToPrint.indexOf(cases[j]), 1);
			} 
		}
		cases = casesToPrint.slice();
	}
	return casesToPrint;
}

function viewCases(nextWindow, categories, tab) {
	var casesToPrint = getCommonCases(categories);
	var toBeRemoved = [];
	var props = [];
	for (var i = 0; i < casesToPrint.length; i++) {
		if (!isLoggedIn && !casesToPrint[i].publicT) {
			toBeRemoved.push(i);
			continue;
		}
		props.push({ properties: { title:casesToPrint[i].name } });
	}
	for (var i = 0; i < toBeRemoved.length; i++) {
		casesToPrint.splice(toBeRemoved[i], 1);
	}
	displayListView(nextWindow, props, createEventFunctionCase(casesToPrint, tab));
}

function listAsString(list) {
	var s = "";
	for (var i = 0; i < list.length; i++) {
		s += list[i].name + (i + 1 < list.length ? ", " : "");
	}
	return s;
}

function getCategoriesToShow(category) {
	var subCats = category.subCategories;
	var catsToShow = [];
	for (var i = 0; i < subCats.length; i++) {
		var tempCats = currentCategories.slice();
		tempCats.push(subCats[i]);
		var temp = getCommonCases(tempCats);
		if (temp.length > 0) {
			var show = false;
			for (var j = 0; j < temp.length; j++) {
				if (isLoggedIn || temp[j].publicT) {
					show = true;
				}
			}
			if (show) {
				catsToShow.push(subCats[i]);
			}
		}
	}
	return catsToShow;
}

function createEventFunctionCategory(currentCategory, subCategories) {
	return function(e) {
		if (e.itemIndex == 0 /*&& currentCategories.length > 1*/) {
			// Show all
			currentCategories.push(new classes.category("*", new Array()));
			var nextWindow = Ti.UI.createWindow({
				title: "Show all",
				backgroundColor: "#fff"
			});
			viewCases(nextWindow, currentCategories, $.tab1);
		}
		else {
			var index = e.itemIndex;
			if (currentCategories.length > 1) {
				index--;
			}
			var prevCat = currentCategory;
			var currCat = subCategories[index];
			currentCategories.push(currCat);
			var nextWindow = Ti.UI.createWindow({
				title: currCat.name,
				backgroundColor: "#fff"
			});
			// Check that this category actually has sub categories
			if (currCat.subCategories.length > 0) {
				// Don't show categories without cases (that can be displayed by this user)
				var catsToShow = getCategoriesToShow(currCat);
				var catObjs = [];
				catObjs.unshift({ properties: { title: 'Show all' } });
				for (var i = 0; i < catsToShow.length; i++) {
					catObjs.push({ properties: { title: catsToShow[i].name } });
				}
				displayListView(nextWindow, catObjs, createEventFunctionCategory(currCat, catsToShow));
			}
			else if (currCat.cases.length > 0) {
				viewCases(nextWindow, currentCategories, $.tab1);
			}
			else {
				nextWindow.addEventListener('close', function(e) {
					currentCategories.pop();
				});
			}
		}
		$.tab1.open(nextWindow);
	};
}

function createEventFunctionCase(cases, tab) {
	return function(e) {
		var view = Ti.UI.createView({
			borderWidth: 1,
			layout: 'vertical',
			height: Ti.UI.SIZE,
		});
		var currentCase = cases[e.itemIndex];
		var nextWindow = Ti.UI.createWindow({
			title: currentCase.name,
			backgroundColor: "#fff",
			layout: 'vertical',
		});
		var objects = [
			//{ properties: { title: currentCase.description } },
			{ properties: { title: 'Videos' } },
			{ properties: { title: 'Images' } }];
		if (tab == $.tab1) {
			currentCategories.push(null);
		}
		var descLabel = Titanium.UI.createLabel({
			text: "Description:",
			font: {fontWeight: 'bold', fontsize: 48},
			color: '#777',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		});
		var label = Titanium.UI.createLabel({
			text: (isLoggedIn ? currentCase.privateDescription : currentCase.publicDescription),
			//borderRadius: 4,
			//borderWidth: 1,
			left: 4,
			right: 4,
			color: '#777',
			font: {fontsize: 48},
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			
			//backgroundColor: 'bbb',
			//borderColor: '#000',
		});
		view.add(descLabel);
		view.add(label);
		nextWindow.add(view);
		displayListView(nextWindow, objects, createMediaFunctionCase(nextWindow, currentCase, tab));
		tab.open(nextWindow);
	};
}

function createMediaFunctionCase(oldWindow, currentCase, tab) {
	return function(e) {
		var activityIndicator = Titanium.UI.createActivityIndicator();
		oldWindow.setRightNavButton(activityIndicator);
		activityIndicator.show();
		var videos = e.itemIndex == 0;
		var nextWindow = Ti.UI.createWindow({
			title: currentCase.name,
			backgroundColor: "#fff"
		});
		
		var views = [];
		for (var i = 0; i < currentCase.mediaFiles.length; i++) {
			// Code for thumbnails
			/*var imageView = Ti.UI.createImageView({
				//image: currentCase.mediaFiles[i].URL
				image: currentCase.mediaFiles[0].URL
			});
			var blob = imageView.toImage();
			blob = blob.imageAsThumbnail(64);
			var thumbnailImageView = Ti.UI.createImageView({
				image: blob
			});
			thumbnailImageView.addEventListener('click', function(e) {
				alert("CLICK!");
			});
			nextWindow.add(thumbnailImageView);*/
			
			var view = null;
			var initialZoom;
			var wrapper = Ti.UI.createScrollView({
		        maxZoomScale : 8,
		        backgroundColor : "black",
			});
			if (currentCase.mediaFiles[i].video && videos) {
				view = Ti.Media.createVideoPlayer({
					autoplay: false,
					mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
					scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
					url: currentCase.mediaFiles[i].URL
				});
				initialZoom = 1.0;
			}
			else if (!currentCase.mediaFiles[i].video && !videos) {
				view = Ti.UI.createImageView({
					image: currentCase.mediaFiles[i].URL
				});
				var temp1 = (Titanium.Platform.displayCaps.platformWidth - 123) / view.toImage().height;
				var temp2 = (Titanium.Platform.displayCaps.platformHeight - 123) / view.toImage().height;
				initialZoom = (temp1 < temp2 ? temp1 : temp2);
			}
			if (view != null) {
				wrapper.minZoomScale = initialZoom;
				wrapper.zoomScale = initialZoom;
				wrapper.add(view);
				views.push(wrapper);
			}
		}
		var scrollableView = Ti.UI.createScrollableView({
			views: views,
			backgroundColor: '#000',
			showPagingControl: true
		});
		nextWindow.add(scrollableView);
		tab.open(nextWindow);
		activityIndicator.hide();
	};
}
var searchArea = Ti.UI.createTextArea({
	borderWidth: 1,
	borderColor: '#aaa',
	borderRadius: 10,
	top: 10,
	left: 10,
	right: 10,
	height: 100,
	font: {fontSize: 20, fontWeight: 'bold' },
	returnKeyType: Ti.UI.RETURNKEY_SEARCH,
});

function initSearch(rootCategory, categories) {
	var searchButton = Titanium.UI.createButton({
		title: 'Search',
		top: 125,
		width: 100,
		height: 50,
	});
	
	var search = function(e) {
		searchArea.blur();
		if (searchArea.getValue() == "") {
			alert("Please type a keyword!");
			return;
		}
		var keywords = searchArea.getValue().split(',');
		var cats = [];
		for (var i = 0; i < keywords.length; i++) {
			keywords[i] = keywords[i].trim().toLowerCase();
			var temp = categories[keywords[i]];
			if (temp != undefined) {
				cats.push(temp);
			}
			else {
				alert("Invalid keyword: " + keywords[i] + "!");
			}
		}
		if (cats.length == 0) {
			//alert("No valid keywords!");
			return;
		}
		/*var string = "";
		for (var i = 0; i < cats.length; i++) {
			string += cats[i].name + ", ";
		}
		alert("Found categories: " + string);*/
		var nextWindow = Ti.UI.createWindow({
			title: 'Search results',
			backgroundColor: "#fff"
		});
		viewCases(nextWindow, cats, $.tab2);
		$.tab2.open(nextWindow);
	};
	
	searchArea.addEventListener('return', search);
	searchButton.addEventListener('click', search);
	
	$.tab2window1.add(searchArea);
	$.tab2window1.add(searchButton);
}

var loginView = null;
var logoutView = null;

function login(username, password) {
	var req = Titanium.Network.createHTTPClient();
	req.onload = function() {
		var json = JSON.parse(this.responseText);
		//alert("Response: " + json.response);
		if (json.response == "1") {
			isLoggedIn = true;
			initLogout();
		} else {
			alert("Login failed!");
		}
	};
	req.onerror = function() {
		alert("Something went wrong!");
	};
	req.open("GET", db.address + "/login.php?username=" + username + "&password=" + password);
	req.send();
}

function initLogout() {
	if (logoutView == null) {
		logoutView = Titanium.UI.createView();
		var logoutButton = Titanium.UI.createButton({
			title: 'Log out',
			top: 50,
			width: 100,
			height: 50,
		});
		logoutButton.addEventListener('click', function(e) {
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
	if (loginView == null) {
		loginView = Titanium.UI.createView();
		var usernameField = Titanium.UI.createTextField({
			top: 10, left: 10, right: 10,
			hintText: 'Username',
			borderWidth: 1,
			borderColor: '#aaa',
			borderRadius: 10,
			height: 35
		});
		var passwordField = Titanium.UI.createTextField({
			hintText: 'Password',
			borderWidth: 1,
			borderColor: '#aaa',
			borderRadius: 10,
			passwordMask: true,
			height: 35,
			left: 10, right: 10, top: 55,
		});
		var button = Titanium.UI.createButton({
			title: 'Log in',
			top: 120,
			width: 100,
			height: 50,
		});
		var loginHelper = function(e) {
			usernameField.blur();
			passwordField.blur();
			login(usernameField.value, passwordField.value);
		};
		button.addEventListener('click', loginHelper);
		passwordField.addEventListener('return', loginHelper);
		usernameField.addEventListener('return', loginHelper);
		loginView.add(usernameField);
		loginView.add(passwordField);
		loginView.add(button);
		$.tab3window1.add(loginView);
	} else {
		logoutView.setVisible(false);
	}
	loginView.setVisible(true);
}

initLogin();

db.initDB($.tab1window1, displayListView, createEventFunctionCategory, initSearch, currentCategories);

//$.tab1window1.setTitle(rootCategory.name);
//displayListView($.tab1window1, rootCategory.getSubCategories(), createEventFunctionCategory(rootCategory));

// displayListView(window2, rootCategory.getSubCategories(), function(e) {
	// var prevCategory = rootCategory;
	// var currentCategory = prevCategory.subCategories[e.itemIndex];
	// var nextWindow = Ti.UI.createWindow({
		// title: currentCategory.name,
		// backgroundColor: "#fff"
	// });
	// displayListView(nextWindow, currentCategory.getSubCategories(), function(e){
		// alert("Something was clicked!");
	// });
	// $.tab1.open(nextWindow);
// });


$.index.open();