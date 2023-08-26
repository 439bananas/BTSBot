/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: validateConfigToken.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: I wish I'd made this earlier :(

const fs = require('fs')
const crypto = require('crypto')

function validateConfToken(token) {
    if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'logintokens.json')) || !token) {
        return false
    } else {
        const { tokens } = require('../../configs/logintokens.json')
        if (tokens.includes(crypto.createHash('sha256').update(token).digest('hex'))) {
            return true
        } else return false
    }
}

module.exports = validateConfToken