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

$.index.open();