/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                 File: index.js                  //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('./logHandler');
const uniconf = require('../configs/uniconf.json')

log.info(`Starting ${uniconf.projname}...`)
const start = require('./init') // This is where the real magic happens