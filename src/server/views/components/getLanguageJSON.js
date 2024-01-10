/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getLanguageJSON.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
let langfile

function getLangFile(languageCode) { // This function gets the contents of the supplied language code, and all of its phrases
    if (fs.existsSync(path.join(__dirname, '..', 'src', 'i18n', languageCode + '.json'))) {
        langfile = require('../src/i18n/' + languageCode + '.json')
        return langfile
    } else {
        return {}
    }
}

module.exports = getLangFile;