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

function createEventFunctionCategory(currentCategory) {
	return function(e) {
		var prevCat = currentCategory;
		var currCat = currentCategory.subCategories[e.itemIndex];
		currentCategories.push(currCat);
		var nextWindow = Ti.UI.createWindow({
			title: currCat.name,
			backgroundColor: "#fff"
		});
		// Check that this category actually has sub categories
		if (currCat.subCategories.length > 0) {
			displayListView(nextWindow, currCat.getSubCategories(), createEventFunctionCategory(currCat));
		}
		else if (currCat.cases.length > 0) {
			var cases = currentCategories[0].cases.slice();
			for (var i = 0; i < currentCategories.length; i++) {
				for (var j = 0; j < cases.length; j++) {
					var index = currentCategories[i].cases.indexOf(cases[j]);
					if (index == -1) {
						cases.splice(cases.indexOf(cases[j]), 1);
					}
				}
			}
			var props = [];
			for (var i = 0; i < cases.length; i++) {
				props[i] = { properties: { title:cases[i].name } };
			}
			displayListView(nextWindow, props, createEventFunctionCase(cases));
		}
		else {
			nextWindow.addEventListener('close', function(e) {
				currentCategories.pop();
			});
		}
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
			
			var view;
			if (currentCase.mediaFiles[i].video) {
				view = Ti.Media.createVideoPlayer({
					autoplay: false,
					mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
					scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
					url: currentCase.mediaFiles[i].URL
				});
			}
			else {
				view = Ti.UI.createImageView({
					image: currentCase.mediaFiles[i].URL
				});
			}
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

db.initDB($.tab1window1, displayListView, createEventFunctionCategory);

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