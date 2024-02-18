/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getApplicationId.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetch = require('node-fetch')
let id
let tokencache

function getid(token) {
    // Why did I not realise how much simpler this could've been...
    let idBase64 = token.split('.')[0] // Slice the token by "."
    let id = Buffer.from(idBase64, 'base64').toString('utf8') // Convert the first part from base64 to decimal

    return id // Return it
}

module.exports = getid;