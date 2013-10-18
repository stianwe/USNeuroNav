function category(name, subCategories) {
    this.name = name;
    this.cases = [];
    this.subCategories = subCategories;
    this.getSubCategories = function() {
        var objs = [];
        for (var i = 0; subCategories.length > i; i++) objs[i] = {
            properties: {
                title: subCategories[i].name
            }
        };
        return objs;
    };
    this.getCases = function() {
        var objs = [];
        for (var i = 0; cases.length > i; i++) objs[i] = {
            properties: {
                title: cases[i].name
            }
        };
        return objs;
    };
}

function caseT(name, description) {
    this.name = name;
    this.description = description;
    this.mediaFiles = new Array();
}

function mediaFile(URL, video) {
    this.URL = URL;
    this.video = video;
}

exports.category = category;

exports.caseT = caseT;

exports.mediaFile = mediaFile;