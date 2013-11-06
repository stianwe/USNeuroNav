
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

function caseT(name, publicDescription, privateDescription, publicT) {
	this.name = name;
	this.publicT = publicT;
	this.publicDescription = publicDescription;
	this.privateDescription = privateDescription;
	this.mediaFiles = new Array();
	
	this.hasVideo = function() {
		for (var i = 0; i < this.mediaFiles.length; i++) {
			if (this.mediaFiles[i].video) {
				return true;
			} 
		}
		return false;
	};
	
	this.hasImage = function() {
		for (var i = 0; i < this.mediaFiles.length; i++) {
			if (!this.mediaFiles[i].video) {
				return true;
			} 
		}
		return false;
	};
}

function mediaFile(URL, video) {
	this.URL = URL;
	this.video = video;
}

// Make the two "functions" publicly available
exports.category = category;
exports.caseT = caseT;
exports.mediaFile = mediaFile;