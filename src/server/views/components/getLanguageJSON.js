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

import { existsSync, readdirSync } from 'fs';
import { basename, dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let languages = {}
let langsDir
if (basename(process.argv[1]) === "index.js") {
    langsDir = join(__dirname, "..", "i18n")
} else {
    langsDir = join(__dirname, "..", "src", "i18n")
}

let langsDirListing = readdirSync(langsDir) // Put each of the language files into an object at the start of runtime, improve performance

langsDirListing.map(file => {
    let fileName = file.split('.')
    if (fileName[fileName.length - 1] == "json") {
        import(pathToFileURL(join(langsDir, file)), { assert: { type: "json" } }).then(mod => {
            if (mod.default.name) {
                languages[file.split(".")[0]] = mod.default
            }
        })
    }
})

async function getLangFile(languageCode) { // This function gets the contents of the supplied language code, and all of its phrases
    if (languages[languageCode]) {
        const langfile = languages[languageCode]
        return langfile
    } else {
        return {}
    }
}

export default getLangFile;