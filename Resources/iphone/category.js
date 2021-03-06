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

function caseT(name, publicDescription, privateDescription, publicT) {
    this.name = name;
    this.publicT = publicT;
    this.publicDescription = publicDescription;
    this.privateDescription = privateDescription;
    this.mediaFiles = new Array();
    this.hasVideo = function() {
        for (var i = 0; this.mediaFiles.length > i; i++) if (this.mediaFiles[i].video) return true;
        return false;
    };
    this.hasImage = function() {
        for (var i = 0; this.mediaFiles.length > i; i++) if (!this.mediaFiles[i].video) return true;
        return false;
    };
}

function mediaFile(URL, video) {
    this.URL = URL;
    this.video = video;
}

exports.category = category;

exports.caseT = caseT;

exports.mediaFile = mediaFile;