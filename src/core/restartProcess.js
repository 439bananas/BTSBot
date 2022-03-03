/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: restartProcess.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const log = require('./logHandler');
const Discord = require('discord.js')
//const client = new Discord.Client()
const translate = require('./getLanguageString')
const getlang = require('./getLanguageJSON')

/*function closeServer() {
    console.log('yeet')
    //server.close()
}*/

function restart() {
    getlang(true).then(lang => {
        log.info(translate(lang, 'log_restarting'))
    })
    // DESTROY DISCORD BOT SOMEWHERE
    process.exit(2) // Exit code 2 signifies to forever-monitor that this is a restart, so it restarts the entire script
};

module.exports = restart;