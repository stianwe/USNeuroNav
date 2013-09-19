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

function caseT(name, mediaFiles) {
    this.name = name;
    this.mediaFiles = mediaFiles;
}

function mediaFile(URL, video, restricted) {
    this.URL = URL;
    this.video = video;
    this.restricted = restricted;
}

exports.category = category;

exports.caseT = caseT;

exports.mediaFile = mediaFile;