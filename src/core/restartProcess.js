/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//             File: restartProcess.js             //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('./logHandler');
const Discord = require('discord.js')
const client = new Discord.Client()

/*function closeServer() {
    console.log('yeet')
    //server.close()
}*/

function restart() {
    log.info('Restarting...')
    // DESTROY DISCORD BOT SOMEWHERE
    process.exit(2)
};

module.exports = restart;