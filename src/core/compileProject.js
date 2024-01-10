/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: compileProject.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getlang = require('./getLanguageJSON');
const { exec } = require('child_process');

getlang(true).then(lang => {
    log.info(translate(lang, "log_buildingproject", "express-engine-jsx")) // Build the script
    exec('npm run build', (error, stdout, stderr) => {
        if (error) {
            log.fatal(error)
        } else require('./init') // Require init so that we can use restart() and events etc
    })
})