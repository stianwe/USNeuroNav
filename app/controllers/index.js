var currentCategories = [];

function displayListView(window, items, eventFunction) {
	var listView = Ti.UI.createListView();
	var section = Ti.UI.createListSection();
	var sections = [];
	section.setItems(items);
	sections.push(section);
	listView.sections = sections;
	listView.addEventListener('itemclick', eventFunction);
	window.addEventListener('close', function(e) {
		currentCategories.pop();
	});
	window.add(listView);
	/*var names = [];
	for (var i = 0; i < currentCategories.length; i++) {
		names[i] = currentCategories[i].name;
	}
	alert(names);*/
}

function viewCases(nextWindow, categories, tab) {
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
	var props = [];
	for (var i = 0; i < casesToPrint.length; i++) {
		props[i] = { properties: { title:casesToPrint[i].name } };
	}
	displayListView(nextWindow, props, createEventFunctionCase(casesToPrint, tab));
}

function createEventFunctionCategory(currentCategory) {
	return function(e) {
		if (e.itemIndex == 0 && currentCategories.length > 0) {
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
			if (currentCategories.length > 0) {
				index--;
			}
			var prevCat = currentCategory;
			var currCat = currentCategory.subCategories[index];
			currentCategories.push(currCat);
			var nextWindow = Ti.UI.createWindow({
				title: currCat.name,
				backgroundColor: "#fff"
			});
			// Check that this category actually has sub categories
			if (currCat.subCategories.length > 0) {
				var subCats = currCat.getSubCategories();
				subCats.unshift({ properties: { title: 'Show all' } });
				displayListView(nextWindow, subCats, createEventFunctionCategory(currCat));
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
		var currentCase = cases[e.itemIndex];
		var nextWindow = Ti.UI.createWindow({
			title: currentCase.name,
			backgroundColor: "#fff"
		});
		var objects = [
			{ properties: { title: 'Videos' } },
			{ properties: { title: 'Images' } }];
		displayListView(nextWindow, objects, createMediaFunctionCase(currentCase, tab));
		tab.open(nextWindow);
	};
}

function createMediaFunctionCase(currentCase, tab) {
	return function(e) {
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
			alert("No valid keywords!");
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

db.initDB($.tab1window1, displayListView, createEventFunctionCategory, initSearch);

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