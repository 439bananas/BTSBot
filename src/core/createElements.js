/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: createElements.cjs                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { warnUser } from './warnUserIfNoConf'

global.translate = (await import('./getLanguageString')).default
global.path = await import('path') // Define anything to be globally used here
global.uniconf = (await import('../configs/uniconf.json', {assert: {type: "json"}})).default
global.pkg = (await import('../../package.json'), {assert: {type: "json"}}).default
global.log = (await import('./logHandler')).default
global.restart = await import('./restartProcess')
global.getlang = (await import('./getLanguageJSON')).default

await warnUser()

//require('../bot/createBot.cjs') // Start the bot

// CREATE BOT MUST ONLY BE CALLED IN DATABASE MANAGER

/*process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    console.log(reason.stack)
    // application specific logging, throwing an error, or other logic here
})*/