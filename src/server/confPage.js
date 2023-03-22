/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: confPage.js                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: Still rather long, a lot prouder than last time

const express = require('express')
const checkConf = require('../core/checkConfExists')
const router = express.Router()
const validateOAuth2 = require('./validateOAuth2')
const showwall = require('./displayWall')
const show404 = require('./display404')
const showconf = require('./displayConf')
const getUserLang = require('../core/getUserLang')
let settings = uniconf.settings
let conf

router.get('/', async (req, res, next) => { // /config endpoint
    res.clearCookie('discordbearertoken')
    global.badclientsecret = false
    getUserLang(req).then(lang => { // ANB for the sake that no options depending on if user signed in or not
        checkConf().then(response => { // Check conf before continuing
            if (response == true) { // If conf good, return 404
                show404(req, res, lang, true)
            }
        }).catch(err => {
            switch (err) {
                case false:
                    checkConf('confinterim').then(result => {
                        log.temp("confPage.js:38")
                        const conf = require('../../configs/confinterim.json')
                        validateOAuth2(req, res, conf)
                        // IF INVALID GRANT, SHOW PAGE WITH ERROR
                    }).catch(confinterimerror => {
                        if (confinterimerror == false) {
                            log.temp("confPage.js:44")
                            log.temp("default language " + uniconf.defaultlanguage)
                            showconf(req, res, lang, uniconf.defaultlanguage, settings[1][1], settings[2][1], settings[3][1], settings[4][1], settings[5][1], settings[6][1], settings[7][1], settings[8][1], settings[9][1], settings[10][1], settings[11][1], settings[12][1], settings[13][1], settings[14][1], settings[15][1], settings[16][1], settings[17][1], settings[18][1], settings[19][1], settings[20][1], settings[21][1])
                        } else {
                            conf = require('../../configs/confinterim.json')
                            log.temp("confPage.js:47")
                            if (conf[settings[0][0]] === undefined) { // We put settings that should be there in uniconf so it's slightly easier to edit as we go along
                                global.gdefaultlanguage = uniconf.defaultlanguage // I don't know if I ever told you this but I absolutely HATE using globals, yet here we are...
                                // ^^ If I recall correctly that might have actually been in a more primative version of the bot and the comment was likely since removed
                            } else {
                                global.gdefaultlanguage = conf.language
                            }
                            if (conf[settings[1][0]] === undefined) { // Here I would use a switch/case statement but given the differing statements, it wouldn't really be pheasible
                                global.ghostname = settings[1][1]
                            } else {
                                global.ghostname = conf.hostname
                            }
                            if (conf[settings[2][0]] === undefined) {
                                global.gusername = settings[2][1]
                            } else {
                                global.gusername = conf.dbusername
                            }
                            if (conf[settings[3][0]] === undefined) {
                                global.gdatabase = settings[3][1]
                            } else {
                                global.gdatabase = conf.database
                            }
                            if (conf[settings[4][0]] === undefined) {
                                global.gtableprefix = settings[4][1]
                            } else {
                                global.gtableprefix = conf.tableprefix
                            }
                            if (conf[settings[5][0]] === undefined) {
                                global.gredishostname = settings[5][1]
                            } else {
                                global.gredishostname = conf.redishostname
                            }
                            if (conf[settings[6][0]] === undefined) {
                                global.gredisusername = settings[6][1]
                            } else {
                                global.gredisusername = conf.redisusername
                            }
                            if (conf[settings[7][0]] === undefined) {
                                global.gredisdatabase = settings[7][1]
                            } else {
                                global.gredisdatabase = conf.redisdatabase
                            }
                            if (conf[settings[8][0]] === undefined) {
                                global.gpstatus = settings[8][1]
                            } else {
                                global.gpstatus = conf.pstatus
                            }
                            if (conf[settings[9][0]] === undefined) {
                                global.gostatus = settings[9][1]
                            } else {
                                global.gostatus = conf.ostatus
                            }
                            if (conf[settings[10][0]] === undefined) {
                                global.gguildid = settings[10][1]
                            } else {
                                global.gguildid = conf.guildid
                            }
                            if (conf[settings[11][0]] === undefined) {
                                global.gmoderatorsroleid = settings[11][1]
                            } else {
                                global.gmoderatorsroleid = conf.moderatorsroleid
                            }
                            if (conf[settings[12][0]] === undefined) {
                                global.ggoogleclientid = settings[12][1]
                            } else {
                                global.ggoogleclientid = conf.googleclientid
                            }
                            if (conf[settings[13][0]] === undefined) {
                                global.gmsclientid = settings[13][1]
                            } else {
                                global.gmsclientid = conf.msclientid
                            }
                            if (conf[settings[14][0]] === undefined) {
                                global.gsmtpserver = settings[14][1]
                            } else {
                                global.gsmtpserver = conf.smtpserver
                            }
                            if (conf[settings[15][0]] === undefined) {
                                global.gsmtpport = settings[15][1]
                            } else {
                                global.gsmtpport = conf.smtpport
                            }
                            if (conf[settings[16][0]] === undefined) {
                                global.gsmtpssl = settings[16][1]
                            } else {
                                global.gsmtpssl = conf.smtpssl
                            }
                            if (conf[settings[17][0]] === undefined) {
                                global.gimapssl = settings[17][1]
                            } else {
                                global.gimapssl = conf.imapssl
                            }
                            if (conf[settings[18][0]] === undefined) {
                                global.gimapserver = settings[18][1]
                            } else {
                                global.gimapserver = conf.imapserver
                            }
                            if (conf[settings[19][0]] === undefined) {
                                global.gimapport = settings[19][1]
                            } else {
                                global.gimapport = conf.imapport
                            }
                            if (conf[settings[20][0]] === undefined) {
                                global.gemailaddress = settings[20][1]
                            } else {
                                global.gemailaddress = conf.emailaddress
                            }
                            if (conf[settings[21][0]] === undefined) {
                                global.gemailusername = settings[21][1]
                            } else {
                                global.gemailusername = conf.emailusername
                            }
                            showconf(req, res, lang, gdefaultlanguage, ghostname, gusername, gdatabase, gtableprefix, gredishostname, gredisusername, gredisdatabase, gpstatus, gostatus, gguildid, gmoderatorsroleid, ggoogleclientid, gmsclientid, gsmtpserver, gsmtpport, gsmtpssl, gimapssl, gimapserver, gimapport, gemailaddress, gemailusername)
                        }
                    })
                    break;
                case "CANNOT_CONNECT_TO_DISCORD":
                    showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2')) // If cannot connect to Discord, send user to wall
                case "MISSING_FIELDS":
                    checkConf('confinterim').then(result => {
                        conf = require('../../configs/confinterim.json')
                        validateOAuth2(req, res, conf)
                    }).catch(confinterimerr => {
                        if (confinterimerr == false) {
                            conf = require('../../configs/conf.json')
                            log.temp("confPage.js:171")
                            if (conf[settings[0][0]] === undefined) { // We put settings that should be there in uniconf so it's slightly easier to edit as we go along
                                global.gdefaultlanguage = uniconf.defaultlanguage // I don't know if I ever told you this but I absolutely HATE using globals, yet here we are...
                                // ^^ If I recall correctly that might have actually been in a more primative version of the bot and the comment was likely since removed
                            } else {
                                global.gdefaultlanguage = conf.language
                            }
                            if (conf[settings[1][0]] === undefined) { // Here I would use a switch/case statement but given the differing statements, it wouldn't really be pheasible
                                global.ghostname = settings[1][1]
                            } else {
                                global.ghostname = conf.hostname
                            }
                            if (conf[settings[2][0]] === undefined) {
                                global.gusername = settings[2][1]
                            } else {
                                global.gusername = conf.dbusername
                            }
                            if (conf[settings[3][0]] === undefined) {
                                global.gdatabase = settings[3][1]
                            } else {
                                global.gdatabase = conf.database
                            }
                            if (conf[settings[4][0]] === undefined) {
                                global.gtableprefix = settings[4][1]
                            } else {
                                global.gtableprefix = conf.tableprefix
                            }
                            if (conf[settings[5][0]] === undefined) {
                                global.gredishostname = settings[5][1]
                            } else {
                                global.gredishostname = conf.redishostname
                            }
                            if (conf[settings[6][0]] === undefined) {
                                global.gredisusername = settings[6][1]
                            } else {
                                global.gredisusername = conf.redisusername
                            }
                            if (conf[settings[7][0]] === undefined) {
                                global.gredisdatabase = settings[7][1]
                            } else {
                                global.gredisdatabase = conf.redisdatabase
                            }
                            if (conf[settings[8][0]] === undefined) {
                                global.gpstatus = settings[8][1]
                            } else {
                                global.gpstatus = conf.pstatus
                            }
                            if (conf[settings[9][0]] === undefined) {
                                global.gostatus = settings[9][1]
                            } else {
                                global.gostatus = conf.ostatus
                            }
                            if (conf[settings[10][0]] === undefined) {
                                global.gguildid = settings[10][1]
                            } else {
                                global.gguildid = conf.guildid
                            }
                            if (conf[settings[11][0]] === undefined) {
                                global.gmoderatorsroleid = settings[11][1]
                            } else {
                                global.gmoderatorsroleid = conf.moderatorsroleid
                            }
                            if (conf[settings[12][0]] === undefined) {
                                global.ggoogleclientid = settings[12][1]
                            } else {
                                global.ggoogleclientid = conf.googleclientid
                            }
                            if (conf[settings[13][0]] === undefined) {
                                global.gmsclientid = settings[13][1]
                            } else {
                                global.gmsclientid = conf.msclientid
                            }
                            if (conf[settings[14][0]] === undefined) {
                                global.gsmtpserver = settings[14][1]
                            } else {
                                global.gsmtpserver = conf.smtpserver
                            }
                            if (conf[settings[15][0]] === undefined) {
                                global.gsmtpport = settings[15][1]
                            } else {
                                global.gsmtpport = conf.smtpport
                            }
                            if (conf[settings[16][0]] === undefined) {
                                global.gsmtpssl = settings[16][1]
                            } else {
                                global.gsmtpssl = conf.smtpssl
                            }
                            if (conf[settings[17][0]] === undefined) {
                                global.gimapssl = settings[17][1]
                            } else {
                                global.gimapssl = conf.imapssl
                            }
                            if (conf[settings[18][0]] === undefined) {
                                global.gimapserver = settings[18][1]
                            } else {
                                global.gimapserver = conf.imapserver
                            }
                            if (conf[settings[19][0]] === undefined) {
                                global.gimapport = settings[19][1]
                            } else {
                                global.gimapport = conf.imapport
                            }
                            if (conf[settings[20][0]] === undefined) {
                                global.gemailaddress = settings[20][1]
                            } else {
                                global.gemailaddress = conf.emailaddress
                            }
                            if (conf[settings[21][0]] === undefined) {
                                global.gemailusername = settings[21][1]
                            } else {
                                global.gemailusername = conf.emailusername
                            }
                            showconf(req, res, lang, gdefaultlanguage, ghostname, gusername, gdatabase, gtableprefix, gredishostname, gredisusername, gredisdatabase, gpstatus, gostatus, gguildid, gmoderatorsroleid, ggoogleclientid, gmsclientid, gsmtpserver, gsmtpport, gsmtpssl, gimapssl, gimapserver, gimapport, gemailaddress, gemailusername)
                        } else {
                            conf = require('../../configs/confinterim.json')
                            log.temp("confPage.js:286")
                            if (conf[settings[0][0]] === undefined) { // We put settings that should be there in uniconf so it's slightly easier to edit as we go along
                                global.gdefaultlanguage = uniconf.defaultlanguage // I don't know if I ever told you this but I absolutely HATE using globals, yet here we are...
                                // ^^ If I recall correctly that might have actually been in a more primative version of the bot and the comment was likely since removed
                            } else {
                                global.gdefaultlanguage = conf.language
                            }
                            if (conf[settings[1][0]] === undefined) { // Here I would use a switch/case statement but given the differing statements, it wouldn't really be pheasible
                                global.ghostname = settings[1][1]
                            } else {
                                global.ghostname = conf.hostname
                            }
                            if (conf[settings[2][0]] === undefined) {
                                global.gusername = settings[2][1]
                            } else {
                                global.gusername = conf.dbusername
                            }
                            if (conf[settings[3][0]] === undefined) {
                                global.gdatabase = settings[3][1]
                            } else {
                                global.gdatabase = conf.database
                            }
                            if (conf[settings[4][0]] === undefined) {
                                global.gtableprefix = settings[4][1]
                            } else {
                                global.gtableprefix = conf.tableprefix
                            }
                            if (conf[settings[5][0]] === undefined) {
                                global.gredishostname = settings[5][1]
                            } else {
                                global.gredishostname = conf.redishostname
                            }
                            if (conf[settings[6][0]] === undefined) {
                                global.gredisusername = settings[6][1]
                            } else {
                                global.gredisusername = conf.redisusername
                            }
                            if (conf[settings[7][0]] === undefined) {
                                global.gredisdatabase = settings[7][1]
                            } else {
                                global.gredisdatabase = conf.redisdatabase
                            }
                            if (conf[settings[8][0]] === undefined) {
                                global.gpstatus = settings[8][1]
                            } else {
                                global.gpstatus = conf.pstatus
                            }
                            if (conf[settings[9][0]] === undefined) {
                                global.gostatus = settings[9][1]
                            } else {
                                global.gostatus = conf.ostatus
                            }
                            if (conf[settings[10][0]] === undefined) {
                                global.gguildid = settings[10][1]
                            } else {
                                global.gguildid = conf.guildid
                            }
                            if (conf[settings[11][0]] === undefined) {
                                global.gmoderatorsroleid = settings[11][1]
                            } else {
                                global.gmoderatorsroleid = conf.moderatorsroleid
                            }
                            if (conf[settings[12][0]] === undefined) {
                                global.ggoogleclientid = settings[12][1]
                            } else {
                                global.ggoogleclientid = conf.googleclientid
                            }
                            if (conf[settings[13][0]] === undefined) {
                                global.gmsclientid = settings[13][1]
                            } else {
                                global.gmsclientid = conf.msclientid
                            }
                            if (conf[settings[14][0]] === undefined) {
                                global.gsmtpserver = settings[14][1]
                            } else {
                                global.gsmtpserver = conf.smtpserver
                            }
                            if (conf[settings[15][0]] === undefined) {
                                global.gsmtpport = settings[15][1]
                            } else {
                                global.gsmtpport = conf.smtpport
                            }
                            if (conf[settings[16][0]] === undefined) {
                                global.gsmtpssl = settings[16][1]
                            } else {
                                global.gsmtpssl = conf.smtpssl
                            }
                            if (conf[settings[17][0]] === undefined) {
                                global.gimapssl = settings[17][1]
                            } else {
                                global.gimapssl = conf.imapssl
                            }
                            if (conf[settings[18][0]] === undefined) {
                                global.gimapserver = settings[18][1]
                            } else {
                                global.gimapserver = conf.imapserver
                            }
                            if (conf[settings[19][0]] === undefined) {
                                global.gimapport = settings[19][1]
                            } else {
                                global.gimapport = conf.imapport
                            }
                            if (conf[settings[20][0]] === undefined) {
                                global.gemailaddress = settings[20][1]
                            } else {
                                global.gemailaddress = conf.emailaddress
                            }
                            if (conf[settings[21][0]] === undefined) {
                                global.gemailusername = settings[21][1]
                            } else {
                                global.gemailusername = conf.emailusername
                            }
                            showconf(req, res, lang, gdefaultlanguage, ghostname, gusername, gdatabase, gtableprefix, gredishostname, gredisusername, gredisdatabase, gpstatus, gostatus, gguildid, gmoderatorsroleid, ggoogleclientid, gmsclientid, gsmtpserver, gsmtpport, gsmtpssl, gimapssl, gimapserver, gimapport, gemailaddress, gemailusername)
                        }
                    })
                    break;
                default:
                    conf = require('../../configs/conf.json') // We can't really require it in the top of the file else BTS Bot would fatally crash if there was no conf file at all, hence rendering the entire thing useless
                    log.temp("confPage.js:405")
                    showconf(req, res, lang, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername)
            }
        })    
    })
})

module.exports = router;