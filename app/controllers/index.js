
function displayListView(window, items, eventFunction) {
	var listView = Ti.UI.createListView();
	var section = Ti.UI.createListSection();
	var sections = [];
	section.setItems(items);
	sections.push(section);
	listView.sections = sections;
	listView.addEventListener('itemclick', eventFunction);
	window.add(listView);
}

function createEventFunction(currentCategory) {
	return function(e) {
		var prevCat = currentCategory;
		var currCat = currentCategory.subCategories[e.itemIndex];
		var nextWindow = Ti.UI.createWindow({
			title: currentCategory.name,
			backgroundColor: "#fff"
		});
		// Check that this category actually has sub categories
		if (currCat.subCategories.length > 0) {
			displayListView(nextWindow, currentCategory.getSubCategories(), createEventFunction(currCat));
		}
		$.tab1.open(nextWindow);
	};
}

var window2 = Ti.UI.createWindow({
	title: "Window2",
	backgroundColor: "#fff"
});

var button = Ti.UI.createButton({
	title: "Click me!"
});

button.addEventListener('click', function() {
	$.tab1.open(window2);
});

$.tab1window1.add(button);

displayListView(window2, rootCategory.getSubCategories(), createEventFunction(rootCategory));

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