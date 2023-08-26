/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: submitConfig.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../../core/checkConfExists')
const fs = require('fs')
const express = require('express');
const router = express.Router()
const createConf = require('../../core/createConf')
const { formidable } = require('formidable');
const validateConfToken = require('../../core/validateConfigToken')
let missingFields

// Man this endpoint really needs a rewrite

router.post('/', async (req, res, next) => {
    try {
        if (validateConfToken(req.cookies.configtoken)) { // Validate the config token
            form = formidable({ maxFields: Infinity }) // Prepare the form

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    log.error(err.toString())
                    res.json({
                        response: err
                    })
                } else if (fields == undefined) { // If we don't do this, if no parameters are supplied then BTS Bot would crash
                    res.status(200);
                    res.json({
                        response: "MISSING_PARAMS"
                    })
                } else {
                    missingFields = false
                    for (i in uniconf.settings) {
                        if (fields[uniconf.settings[i][0]] === undefined && uniconf.settings[i][0] != "ownerid") { // Iterate through the list of settings to see if there are any that are not specified; owner ID is not going to be sent so we can ignore it
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
                        }).catch(async err => {
                            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'confinterim.json'))) { // Check for conf interim, if all good then throw this error in API
                                checkConf('confinterim').then(result => {
                                    if (badclientsecret === true) {
                                        try {
                                            createConf(req, res, fields).then(response => { // Creating conf is slow, we don't want to restart before we've created it so let's wrap it in a promise
                                                res.status(200)
                                                res.json({
                                                    response: "VERIFY_CLIENT_SECRET"
                                                })
                                                const conf = require('../../../configs/confinterim.json')
                                                log.info(translate(conf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'confinterim.json'))
                                                log.info(translate(conf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(conf.language, 'log_changestakeefect_part2'))
                                                restart()
                                            })
                                        } catch (err) {
                                            void err
                                        }
                                    } else {
                                        res.status(200);
                                        res.json({
                                            response: "CONF_OK"
                                        })
                                    }
                                }).catch(err => { // If error in conf interim create conf again
                                    createConf(req, res, fields).then(response => { // Creating conf is slow, we don't want to restart before we've created it so let's wrap it in a promise
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
                                    log.info(translate(fields.language), "log_creatingconfdirectory")
                                    fs.mkdirSync(path.join(__dirname, '..', 'configs'))
                                }
                                try {
                                    createConf(req, res, fields).then(response => {
                                        res.status(200)
                                        res.json({
                                            response: "VERIFY_CLIENT_SECRET"
                                        })
                                        const conf = require('../../../configs/confinterim.json')
                                        log.info(translate(conf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'confinterim.json'))
                                        log.info(translate(conf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(conf.language, 'log_changestakeefect_part2'))
                                        restart()
                                    })
                                } catch (err) {
                                    void err
                                }
                            }
                        })
                    }
                }
            })
        } else {
            res.json({
                response: "INVALID_CONFIG_TOKEN"
            })
        }
    } catch (err) {
        res.status(200);
        log.error(err.toString())
        res.json({
            response: err
        })
    }
})

module.exports = router;