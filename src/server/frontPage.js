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
const router = express.Router()
const getid = require('../core/getApplicationId')
const showhome = require('./displayHome')
const showwall = require('./displayWall')
const shownci = require('./displayNoConfIntro')
const getUserLang = require('../core/getUserLang')
let clientid
let lang

router.get('/', async (req, res, next) => { // When / is GET'd, if checkConf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    // Get default language if no user language is set
        if (req.confExists) {
            const conf = require('../configs/conf.json')
            getid(conf.token).then(id => {
                clientid = id
                getUserLang(req).then(lang => {
                    showhome(req, res, lang, clientid, req.user)
                })
            }).catch(err => {
                getUserLang(req).then(lang => {
                    showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                })
            })
        } else {
            let err = req.confErr
            void err // This is stupid but this line is kinda required so that te project does not crash???
            lang = getlang()
            let confpath = path.join(__dirname, 'configs') // Set defaults
            let noconfintro1 = ""
            let noconfintro2 = ""
            let noconfintro3 = ""
            let noconfintro4 = ""
            let noconfintrodiag = translate(lang, 'page_noconfintrodiag')
            log.temp(err)
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

            if (err != "CANNOT_CONNECT_TO_DISCORD") {
                shownci(res, lang, confpath, noconfintro1, noconfintro2, noconfintro3, noconfintro4, noconfintrodiag)
            }
        }
})

module.exports = router;