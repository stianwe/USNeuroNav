function category(name, subCategories) {
	this.name = name;
	// List of categories
	this.subCategories = subCategories;
	
	this.getSubCategories = function getSubCategories() {
		var objs = [];
		for (var i = 0; i < subCategories.length; i++) {
			objs[i] = { properties: { title: subCategories[i].name}};
		}
		return objs;
	};
	
}

function caseT(name) {
	this.name = name;
}

// Make the two "functions" publicly available
exports.category = category;
exports.caseT = caseT;