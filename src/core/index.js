/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: index.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: You should never call restart() within this file; the script stops while the server and bot continue to run

global.uniconf = (await import('../configs/uniconf.json', { assert: { type: "json" } })).default
global.log = (await import('./logHandler.js')).default;
import('./getLanguageString.js').then(translateMod => {
    global.translate = translateMod.default

    import('./getLanguageJSON.js').then((getlangMod) => {
        global.getlang = getlangMod.default
        getlang(true).then(async lang => { // Get language and then get translation string
            log.info(`${await translate(lang, "log_startingbtsbot", "express-engine-jsx")}${uniconf.projname}...`)
        })

        import('./compileProject.cjs') // This is where the real magic happens
    })
})