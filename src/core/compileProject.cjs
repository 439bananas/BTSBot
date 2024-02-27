/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: compileProject.cjs                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { exec } = require('child_process');

getlang(true).then(lang => {
    log.info(translate(lang, "log_buildingproject")) // Build the script
    exec('npm run build', (error, stdout, stderr) => {
        if (error) {
            log.fatal(error)
        } else require('./init.cjs') // Require init so that we can use restart() and events etc
    })
})