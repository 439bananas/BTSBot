/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//            File: convertQueryStringToJSON.js            //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function query2JSON(string) { // Does what it says on the tin.
    let parsedData = new URLSearchParams(string)
    let json = {}
    parsedData.forEach((value, key) => {
        json[key] = value
    })
    return json
}

module.exports = query2JSON;