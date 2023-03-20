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

const express = require('express')
const router = express.Router()
const getid = require('../core/getApplicationId')
const showhome = require('./displayHome')
const showwall = require('./displayWall')
const shownci = require('./displayNoConfIntro')
const getUserLang = require('../core/getUserLang')
let clientid
let lang

router.get('/', async function (req, res, next) { // When / is GET'd, if checkConf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    // Get default language if no user language is set
        if (req.confExists) {
            const conf = require('./configs/conf.json')
            getid(conf.token).then(id => {
                clientid = id
                getUserLang(req).then(lang => {
                    showhome(req, res, lang, clientid)
                })
            }).catch(err => {
                getUserLang(req).then(lang => {
                    showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                })
            })
        } else {
            let err = req.confErr
            void err // This is stupid but this line is kinda required so that the project does not crash???
            lang = await getUserLang(req)

            if (err != "CANNOT_CONNECT_TO_DISCORD") {
                shownci(req, res, lang, err)
            } else {
                showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
            }
        }
})

module.exports = router;