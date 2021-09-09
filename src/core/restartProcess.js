const log = require('./logHandler');
const Discord = require('discord.js')
const client = new Discord.Client()
const http = require('http')
const svrmgr = require('../server/serverManagerFunctions')

function restart() {
    log.info('Restarting...')
    // DESTROY DISCORD BOT SOMEWHERE
    svrmgr.closeServer()
    process.exit(2)
};

module.exports = restart;