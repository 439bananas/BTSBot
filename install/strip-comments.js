/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: strip-comments.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const strip = require('strip-comments');
const fs = require('fs');

console.log("Stripping comments...")

fs.readFile('../src/server/views/resources/css/twemoji-amazing.css', 'utf8', function(err, data) { // Read the file then remove the comments
    if (err) throw err;
    fs.writeFile('../src/server/views/resources/css/twemoji-amazing.css', strip(data), function (err) {
        if (err) return console.log(err);
    });
});

