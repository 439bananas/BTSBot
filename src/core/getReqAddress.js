/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getReqAddress.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function getaddress(req) {
    let protocol
    if (req.headers['x-forwarded-proto']) {
        protocol = req.headers['x-forwarded-proto']
    } else {
        protocol = req.protocol
    }

    if (req.headers['x-forwarded-host']) {
        return protocol + "://" + req.headers['x-forwarded-host']
    } else {
        return protocol + "://" + req.headers.host
    }
}

module.exports = getaddress;