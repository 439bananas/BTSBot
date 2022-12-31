/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: frontPage.js                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: Slightly janky but better than before

const path = require('path')
const express = require('express')
const fs = require('fs')
const checkConf = require('../core/checkConfExists')
const router = express.Router()
const getid = require('../core/getApplicationId')
const showhome = require('./displayHome')
const showwall = require('./displayWall')
const shownci = require('./displayNoConfIntro')
const checkDatabase = require('../core/checkDb')
const getUserLang = require('../core/getUserLang')
let lang

global.discordsuccess = false // Ensure we only ping Discord's API once
router.get('/', async (req, res, next) => { // When / is GET'd, if checkConf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    // Get default language if no user language is set
    log.temp('/ called')
    if (discordsuccess == false) {
        log.temp('checking conf at line frontPage.js:33')
        checkConf().then(result => {
            const conf = require('../configs/conf.json')
            global.discordsuccess = true
            log.temp("frontPage.js:37 - client id has been fetched")
            getid(conf.token).then(id => {
                global.clientid = id
                getUserLang(req).then(lang => {
                    log.temp("home is being displayed at frontPage.js:41")
                    showhome(req, res, lang, clientid)
                })
            }).catch(err => {
                log.temp(err)
                console.log("ERROR")
            })
        }).catch(err => {
            log.warn(err + ": " + projname + translate(lang, "log_cannotconnecttodiscordwarn")) // This is stupid but this line is kinda required so that te project does not crash???
            lang = getlang()
            let confpath = path.join(__dirname, 'configs') // Set defaults
            let noconfintro1 = ""
            let noconfintro2 = ""
            let noconfintro3 = ""
            let noconfintro4 = ""
            let noconfintrodiag = translate(lang, 'page_noconfintrodiag')
            switch (err) {
                case false:
                    noconfintro1 = translate(lang, 'page_noconfintropart1')
                    noconfintro2 = translate(lang, 'page_noconfintropart2')
                    noconfintro3 = translate(lang, 'page_noconfintropart3')
                    noconfintro4 = translate(lang, 'page_noconfintropart4')
                    break;
                case "MISSING_FIELDS":
                    noconfintro1 = translate(lang, 'page_noconfintromissingfieldspart1')
                    noconfintro2 = translate(lang, 'page_noconfintromissingfieldspart2')
                    noconfintro3 = translate(lang, 'page_noconfintromissingfieldspart3')
                    noconfintro4 = translate(lang, 'page_noconfintromissingfieldspart4')
                    break;
                case "TOKEN_INVALID":
                    noconfintro1 = translate(lang, 'page_noconfintrobadtokenpart1')
                    noconfintro2 = translate(lang, 'page_noconfintrobadtokenpart2')
                    noconfintro3 = translate(lang, 'page_noconfintrobadtokenpart3')
                    noconfintro4 = translate(lang, 'page_noconfintrobadtokenpart4')
                    noconfintrodiag = translate(lang, 'page_noconfintrobadtokendiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintrobadtokendiagpart2')
                    break;
                case "CANNOT_CONNECT_TO_DISCORD": // Display wall
                    log.temp("frontPage.js:77")
                    showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                    break;
                case "CONNECTION_REFUSED":
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>"
                    confpath = ""
                    noconfintro4 = translate(lang, 'page_noconfintroconnectionrefused')
                    noconfintrodiag = translate(lang, 'page_noconfintroconnectionrefuseddiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2')
                    break;
                case "INCORRECT_CREDENTIALS":
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>"
                    confpath = ""
                    noconfintro4 = translate(lang, 'page_noconfintroincorrectcredentials')
                    break;
                case "ACCESS_DENIED":
                    let conf = require('../configs/conf.json')
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>"
                    confpath = ""
                    noconfintro4 = translate(lang, 'page_noconfintroaccessdenied')
                    noconfintrodiag = translate(lang, 'page_noconfintroaccessdenieddiagpart1') + conf.database + ".*" + translate(lang, 'page_noconfintroaccessdenieddiagpart2') + conf.dbusername + "@" + conf.hostname
                    break;
                case "REDIS_CONNECTION_REFUSED":
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>"
                    confpath = ""
                    noconfintro4 = translate(lang, 'page_noconfintroredisconnectionrefused')
                    noconfintrodiag = translate(lang, 'page_noconfintroconnectionrefuseddiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2')
                    break;
                case "WRONGPASS":
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>"
                    confpath = ""
                    noconfintro4 = translate(lang, 'page_noconfintroincorrectcredentials')
                    noconfintrodiag = translate(lang, 'page_noconfintrodiag')
                    break;
                case "BAD_DATABASE":
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>"
                    confpath = ""
                    noconfintro3 = translate(lang, 'page_redisbaddatabasepart1')
                    noconfintro4 = translate(lang, 'page_redisbaddatabasepart2') + "<code>redis.conf</code>" + translate(lang, 'page_redisbaddatabasepart3')
                    noconfintrodiag = translate(lang, 'page_redisbaddatabasediagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_redisbaddatabasediagpart2') + "<code>conf.json</code>" + translate(lang, "page_redisbaddatabasediagpart3") + "<code>redis.conf</code>"
                    break;
                default:
                    noconfintro1 = "<div style=\"display:none\">"
                    noconfintro2 = "</div>" + translate(lang, 'page_noconfintrounknowndiscorderror1')
                    noconfintro4 = translate(lang, 'page_noconfintrounknowndiscorderror2')
                    noconfintrodiag = translate(lang, "page_confunknownerrordiag") + "<a href=\"" + uniconf.discord + "\">" + translate(lang, 'global_discorderver') + "</a>" + translate(lang, 'page_serverlostconnectiondiagpart3')
                    confpath = ""
                    log.error(err)
                    break;
            }

            log.temp("frontPage.js:134")

            if (err != "CANNOT_CONNECT_TO_DISCORD") {
                shownci(res, lang, confpath, noconfintro1, noconfintro2, noconfintro3, noconfintro4, noconfintrodiag)
            }
        })
    } else {
        if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) { // If no conf, then return that warning
            log.temp("frontPage.js:142")
            let lang = getlang()
            shownci(res, lang, path.join(__dirname, 'configs'), translate(lang, 'page_noconfintropart1'), translate(lang, 'page_noconfintropart2'), translate(lang, 'page_noconfintropart3'), translate(lang, 'page_noconfintropart4'), translate(lang, 'page_noconfintropartdiag'))
        } else {
            const conf = require('../configs/conf.json')
            checkDatabase(conf.hostname, conf.dbusername, conf.dbpassword, conf.database, conf.redishostname, conf.redisusername, conf.redispassword, conf.redisdatabase).then(result => {
                log.temp("frontPage.js:148")
                getUserLang(req).then(lang => {
                    showhome(req, res, lang, clientid)
                })
            }).catch(err => {
                lang = getlang()
                let noconfintro1 = "<div style=\"display:none\">"
                let noconfintro2 = "</div>"
                let noconfintro3 = ""
                let noconfintro4 = ""
                let noconfintrodiag = ""
                let confpath = ""
                switch (err) {
                    case "CONNECTION_REFUSED":
                        noconfintro4 = translate(lang, 'page_noconfintroconnectionrefused')
                        noconfintrodiag = translate(lang, 'page_noconfintroconnectionrefuseddiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2')
                        break;
                    case "INCORRECT_CREDENTIALS":
                        noconfintro4 = translate(lang, 'page_noconfintroincorrectcredentials')
                        noconfintrodiag = translate(lang, 'page_noconfintrodiag')
                        break;
                    case "ACCESS_DENIED":
                        let conf = require('../configs/conf.json')
                        noconfintro4 = translate(lang, 'page_noconfintroaccessdenied')
                        noconfintrodiag = translate(lang, 'page_noconfintroaccessdenieddiagpart1') + conf.database + ".*" + translate(lang, 'page_noconfintroaccessdenieddiagpart2') + conf.dbusername + "@" + conf.hostname
                        break;
                    case "REDIS_CONNECTION_REFUSED":
                        noconfintro4 = translate(lang, 'page_noconfintroredisconnectionrefused')
                        noconfintrodiag = translate(lang, 'page_noconfintroconnectionrefuseddiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2')
                        break;
                    case "WRONGPASS":
                        noconfintro4 = translate(lang, 'page_noconfintroincorrectcredentials')
                        noconfintrodiag = translate(lang, 'page_noconfintrodiag')
                        break;
                    case "BAD_DATABASE":
                        noconfintro3 = translate(lang, 'page_redisbaddatabasepart1')
                        noconfintro4 = translate(lang, 'page_redisbaddatabasepart2') + "<code>redis.conf</code>" + translate(lang, 'page_redisbaddatabasepart3')
                        noconfintrodiag = translate(lang, 'page_redisbaddatabasediagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_redisbaddatabasediagpart2') + "<code>conf.json</code>" + translate(lang, "page_redisbaddatabasediagpart3") + "<code>redis.conf</code>"
                        break;
                    default:
                        noconfintro2 = "</div>" + translate(lang, 'page_noconfintrounknowndiscorderror1')
                        noconfintro4 = translate(lang, 'page_noconfintrounknowndiscorderror2')
                        noconfintrodiag = translate(lang, "page_confunknownerrordiag") + "<a href=\"" + uniconf.discord + "\">" + translate(lang, 'global_discorderver') + "</a>" + translate(lang, 'page_serverlostconnectiondiagpart3')
                        log.error(err)
                        break;
                }
                log.temp("frontPage.js:194")
                shownci(res, lang, confpath, noconfintro1, noconfintro2, noconfintro3, noconfintro4, noconfintrodiag)
            })
        }
    }
})

module.exports = router;