/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: submitConfig.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../../core/checkConfExists')
const show404 = require('../display404')
const fs = require('fs')
const express = require('express');
const router = express.Router()
const formidable = require('express-formidable')
const createConf = require('../../core/createConf')
const getUserLang = require('../../core/getUserLang')
let missingFields

router.use(formidable()) // Grab fields of form entered

router.post('/', async (req, res, next) => {
    if (req.fields == undefined) { // If we don't do this, if no parameters are supplied then BTS Bot would crash
        res.status(200);
        res.json({
            response: "MISSING_PARAMS"
        })
    } else {
        missingFields = false
        for (i in uniconf.settings) {
            if (req.fields[uniconf.settings[i][0]] === undefined && uniconf.settings[i][0] != "ownerid") { // Iterate through the list of settings to see if there are any that are not specified; owner ID is not going to be sent so we can ignore it
                missingFields = true
                break; // To reduce the cycles in the loop, we break once there is a missing parameter
            }
        }
        if (missingFields) { // If there is a missing parameter, throw this out
            res.status(200);
            res.json({
                response: "MISSING_PARAMS"
            })
        } else { // Else, begin a few checks...
            checkConf().then(result => { // So that no one can submit the config while it's operational
                res.status(200);
                res.json({
                    response: "CONF_OK"
                })
            }).catch(err => {
                if (fs.existsSync(path.join(__dirname, '..', 'configs', 'confinterim.json'))) { // Check for conf interim, if all good then throw this error in API
                    // SEE IF WE CRASH IF CONFIGS DIR DOES NOT EXIST
                    checkConf('confinterim').then(result => {
                        if (badclientsecret === true) {
                            createConf(req, res).then(response => { // Creating conf is slow, we don't want to restart before we've created it so let's wrap it in a promise
                                res.status(200)
                                res.json({
                                    response: "VERIFY_CLIENT_SECRET"
                                })
                                const conf = require('../../../configs/confinterim.json')
                                log.info(translate(conf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'confinterim.json'))
                                log.info(translate(conf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(conf.language, 'log_changestakeefect_part2'))
                                restart()
                            })
                        } else {
                            res.status(200);
                            res.json({
                                response: "CONF_OK"
                            })
                        }
                    }).catch(err => { // If error in conf interim create conf again
                        createConf(req, res).then(response => { // Creating conf is slow, we don't want to restart before we've created it so let's wrap it in a promise
                            res.status(200)
                            res.json({
                                response: "VERIFY_CLIENT_SECRET"
                            })
                            const conf = require('../../../configs/confinterim.json')
                            log.info(translate(conf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'confinterim.json'))
                            log.info(translate(conf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(conf.language, 'log_changestakeefect_part2'))
                            restart()
                        })
                    })
                } else {
                    if (!fs.existsSync(path.join(__dirname, '..', 'configs'))) {
                        log.info(translate(req.fields.language), "log_creatingconfdirectory")
                        fs.mkdirSync(path.join(__dirname, '..', 'configs'))
                    }
                    createConf(req, res).then(response => {
                        res.status(200)
                        res.json({
                            response: "VERIFY_CLIENT_SECRET"
                        })
                        const conf = require('../../../configs/confinterim.json')
                        log.info(translate(conf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'confinterim.json'))
                        log.info(translate(conf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(conf.language, 'log_changestakeefect_part2'))
                        restart()
                    })
                }
            })
        }
    }
})

router.get('/', async (req, res, next) => { // This should totally not be GET'd
    checkConf().catch(err => {
        getUserLang(req)
            .then(langcode => {
                if (err) {  // If error in conf, don't show things like login etc that couldn't possibly exist
                    show404(req, res, langcode, false)
                } else {
                    show404(req, res, langcode, true)
                }
            })
    })
});

module.exports = router;