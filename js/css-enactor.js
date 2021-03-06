var cssEnactor = {};

cssEnactor.transforms = {};

cssEnactor.transforms.rawValue = function (value) {
    return value;
};

cssEnactor.transforms.toRem = function (value) {
    return value + "rem";
};

cssEnactor.transforms.toPixel = function (value) {
    return value + "px";
};

cssEnactor.transforms.contrastForeground = function (value) {
    return cssEnactor.contrastThemes[value].foreground;
};

cssEnactor.transforms.contrastBackground = function (value) {
    return cssEnactor.contrastThemes[value].background;
};

cssEnactor.contrastThemes = {
    "none": {
        "foreground": "initial",
        "background": "initial"
    },
    "White on Black": {
        "foreground": "#FFF",
        "background": "#000"
    },
    "Black on White": {
        "foreground": "#000",
        "background": "#FFF",
    },
    "Yellow on Black": {
        "foreground": "#FF0",
        "background": "#000"
    },
    "Black on Yellow": {
        "foreground": "#000",
        "background": "#FF0"
    }
};

cssEnactor.enactmentMap = {};

cssEnactor.enactmentMap.textSpacing = {
        lineHeight: {
            selectorSets: {
                "page": ["body"],
                "preview": ["#preview-area"]
            },
            properties: {
                "line-height": {
                    transform: cssEnactor.transforms.rawValue
                }
            }
        },
        paragraphSpacing: {
            selectorSets: {
                "page": ["p"],
                "preview": ["#preview-area p"]
            },
            properties: {
                "margin-bottom": {
                    transform: cssEnactor.transforms.toRem
                }
            }
        },
        letterSpacing: {
            selectorSets: {
                "page": ["body"],
                "preview": ["#preview-area"]
            },
            properties: {
                "letter-spacing": {
                    transform: cssEnactor.transforms.rawValue
                }
            }
        },
        wordSpacing: {
            selectorSets: {
                "page": ["body"],
                "preview": ["#preview-area"]
            },
            properties: {
                "word-spacing": {
                    transform: cssEnactor.transforms.rawValue
                }
            }
        }
};

cssEnactor.enactmentMap.font = {
    fontSize: {
        selectorSets: {
            "page": ["body"],
            "preview": ["#preview-area"]
        },
        properties: {
            "font-size": {
                transform: cssEnactor.transforms.toPixel
            }
        }
    },
    fontFamily: {
        selectorSets: {
            "page": ["body"],
            "preview": ["#preview-area"]
        },
        properties: {
            "font-family": {
                transform: cssEnactor.transforms.rawValue
            }
        }
    }
};

cssEnactor.enactmentMap.colors = {
    contrast: {
        selectorSets: {
            "page": ["body"],
            "preview": ["#preview-area"]
        },
        properties: {
            "color": {
                transform: cssEnactor.transforms.contrastForeground
            },
            "background-color": {
                transform: cssEnactor.transforms.contrastBackground
            }
        }
    }
};

cssEnactor.enact = function (preferenceStore, selectorSet) {
    var preferenceTypes = Object.keys(preferenceStore);
    preferenceTypes.forEach(function (preferenceType) {

        var preferenceSettings = preferenceStore[preferenceType];

        var preferenceEnactors = cssEnactor.enactmentMap[preferenceType];

        var enactorKeys = Object.keys(preferenceEnactors);
        enactorKeys.forEach(function (enactorKey) {
            var preferenceSetting = preferenceSettings[enactorKey];
            var value = preferenceSetting.value;
            var enactor = preferenceEnactors[enactorKey];
            if(enactor.selectorSets && enactor.properties) {
                var selectors = enactor.selectorSets[selectorSet];
                var properties = Object.keys(enactor.properties);
                selectors.forEach(function (selector) {
                    var matched = document.querySelectorAll(selector);
                    for(var i=0; i<matched.length; i++) {
                        properties.forEach(function (property) {
                            var transformFunc = enactor.properties[property].transform;
                            matched[i].style.setProperty(property, transformFunc(value), "important");
                        });

                    }
                });
            }
        });
    });
};

// TODO: split out function to enact a single preference at lines 90-106
cssEnactor.enactPreference = function () {

};
