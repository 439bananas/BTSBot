/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getReqAddress.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function getaddress(req) {
    if (req.headers['x-forwarded-proto']) {
        var protocol = req.headers['x-forwarded-proto']
    } else {
        var protocol = req.protocol
    }

    if (req.headers['x-forwarded-host']) {
        return protocol + "://" + req.headers['x-forwarded-host']
    } else {
        return protocol + "://" + req.headers.host
    }
}

module.exports = getaddress;