/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: checkConfExists.js             //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

async function checkforconf() {
    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) { // Does src/configs/conf.json exist? If yes, return true. Else, false
        return true;
    }
    else {
        return false;
    }
}

module.exports = checkforconf;