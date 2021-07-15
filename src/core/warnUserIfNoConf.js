/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: warnUserIfNoConf.js            //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('./logHandler')
const checkconf = require('./checkConfExists')
const uniconf = require('../configs/uniconf.json')

log.info(`Checking for a conf.json file...`)
checkconf().then(result => { // Check for the configuration file, if false is returned, warn the user
    if (result == false) {
        log.warn(`There does not seem to be a conf.json file, that ${uniconf.projname} can access, for it to properly function. Please follow the steps by navigating to localhost:${uniconf.port} in your web browser of choice to rectify this and generate one.`)
    }
})