
function category(name, subCategories) {
	this.name = name;
	this.cases = [];
	// List of categories
	this.subCategories = subCategories;
	
	this.getSubCategories = function getSubCategories() {
		var objs = [];
		for (var i = 0; i < subCategories.length; i++) {
			objs[i] = { properties: { title: subCategories[i].name } };
		}
		return objs;
	};
	
	this.getCases = function getCases() {
		var objs = [];
		for (var i = 0; i < cases.length; i++) {
			objs[i] = { properties: { title: cases[i].name } };
		}
		return objs;
	};
	
}

function caseT(name, description, publicT) {
	this.name = name;
	this.publicT = publicT;
	this.description = description;
	this.mediaFiles = new Array();
}

function mediaFile(URL, video) {
	this.URL = URL;
	this.video = video;
}

// Make the two "functions" publicly available
exports.category = category;
exports.caseT = caseT;
exports.mediaFile = mediaFile;