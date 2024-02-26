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

import { existsSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let langfile

async function getLangFile(languageCode) { // This function gets the contents of the supplied language code, and all of its phrases
    if (existsSync(join(__dirname, '..', 'src', 'i18n', languageCode + '.json'))) {
        const langfile = (await import('../src/i18n/' + languageCode + '.json', { assert: { type: "json" } })).default
        return langfile
    } else {
        return {}
    }
}

export default getLangFile;