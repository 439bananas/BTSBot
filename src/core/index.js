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

// NOTES: You should never call restart() within this file; the script stops while the server and bot continue to run

const log = require('./logHandler');
const uniconf = require('../configs/uniconf.json')

log.info(`Starting ${uniconf.projname}...`)
const start = require('./init') // This is where the real magic happens