function category(name, subCategories) {
    this.name = name;
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
}

function caseT(name) {
    this.name = name;
}

exports.category = category;

exports.caseT = caseT;