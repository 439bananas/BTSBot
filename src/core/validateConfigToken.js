/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: validateConfigToken.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: I wish I'd made this earlier :(

import { existsSync } from 'fs'
import { createHash } from 'crypto'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function validateConfToken(token) {
    if (!existsSync(path.join(__dirname, '..', 'configs', 'logintokens.json')) || !token) {
        return false
    } else {
        const { tokens } = (await import('../../configs/logintokens.json', { assert: { type: "json" } })).default
        if (tokens.includes(createHash('sha256').update(token).digest('hex'))) {
            return true
        } else return false
    }
}

export default validateConfToken