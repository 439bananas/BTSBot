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
const checkMySQL = require('../core/checkMySQL')
const router = express.Router()
const getid = require('../core/getApplicationId')
const showhome = require('./displayHome')
const showwall = require('./displayWall')
const shownci = require('./displayNoConfIntro')

global.discordsuccess = false // Ensure we only ping Discord's API once
router.get('/', async (req, res, next) => { // When / is GET'd, if checkConf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    getlang().then(lang => { // Get default language if no user language is set
        // AT THIS POINT, WE WILL GET THE USER LANGUAGE BUT THERE IS NO DB SET UP YET SO THAT IS NOT POSSIBLE
        // ANB
        if (discordsuccess == false) {
            checkConf().then(result => {
                const conf = require('../configs/conf.json')
                global.discordsuccess = true
                getid(conf.token).then(id => {
                    global.clientid = id
                    showhome(req, res, lang, clientid)
                })
            }).catch(err => {
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
                        showwall(res, lang, translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttodiscorddiag'))
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
                        noconfintrodiag = translate(lang, 'page_noconfintroaccessdenieddiagpart1') + conf.db + ".*" + translate(lang, 'page_noconfintroaccessdenieddiagpart2') + conf.username + "@" + conf.hostname
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

                if (err != "CANNOT_CONNECT_TO_DISCORD") {
                    shownci(res, lang, confpath, noconfintro1, noconfintro2, noconfintro3, noconfintro4, noconfintrodiag)
                }
            })
        } else {
            if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) { // If no conf, then return that warning
                shownci(res, lang, path.join(__dirname, 'configs'), translate(lang, 'page_noconfintropart1'), translate(lang, 'page_noconfintropart2'), translate(lang, 'page_noconfintropart3'), translate(lang, 'page_noconfintropart4'), translate(lang, 'page_noconfintropartdiag'))
            } else {
                const conf = require('../configs/conf.json')
                checkMySQL(conf.hostname, conf.dbusername, conf.dbpassword, conf.db).then(result => { // We decided to skip all the checks for undefined because that's already going to be checked when discordsuccess is 0
                    showhome(req, res, lang, clientid)
                }).catch(err => {
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
                            noconfintrodiag = translate(lang, 'page_noconfintroaccessdenieddiagpart1') + conf.db + ".*" + translate(lang, 'page_noconfintroaccessdenieddiagpart2') + conf.username + "@" + conf.hostname
                            break;
                        default:
                            noconfintro2 = "</div>" + translate(lang, 'page_noconfintrounknowndiscorderror1')
                            noconfintro4 = translate(lang, 'page_noconfintrounknowndiscorderror2')
                            noconfintrodiag = translate(lang, "page_confunknownerrordiag") + "<a href=\"" + uniconf.discord + "\">" + translate(lang, 'global_discorderver') + "</a>" + translate(lang, 'page_serverlostconnectiondiagpart3')
                            log.error(err)
                            break;
                    }
                    shownci(res, lang, confpath, noconfintro1, noconfintro2, noconfintro3, noconfintro4, noconfintrodiag)
                })
            }
        }
    })
})

module.exports = router;