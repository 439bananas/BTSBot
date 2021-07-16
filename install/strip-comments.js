/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//             File: strip-comments.js             //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const strip = require('strip-comments');
const fs = require('fs');

console.log("Stripping comments...")

fs.readFile('../src/server/pages/resources/twemoji-amazing.css', 'utf8', function(err, data) { // Read the file then remove the comments
    if (err) throw err;
    fs.writeFile('../src/server/pages/resources/twemoji-amazing.css', strip(data), function (err) {
        if (err) return console.log(err);
    });
});

