/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: createConf.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: I think this file and submitConfig.js both need extensive rewrites <- ANB

const fs = require('fs')
const checkMySQL = require('./checkMySQL')
const checkRedis = require('./checkRedis')
const checkDiscord = require('./checkDiscord')
const getOwner = require('./getOwnerID')
let confSettings
let owner

function createConf(req, res) { // Create interim conf so OAuth2 can be validated
    return new Promise(function (resolve, reject) {
        checkMySQL(req.fields.hostname, req.fields.dbusername, req.fields.dbpassword, req.fields.database).then(result => { // Check the given MySQL info
            checkRedis(req.fields.redishostname, req.fields.redisusername, req.fields.redispassword, req.fields.redisdatabase).then(result => {
                checkDiscord(req.fields.token).then(discordresult => { // Do the same with the token
                    confSettings = "" // Assume there are no settings to start off with
                    for (i in uniconf.settings) { // Loop through the settings dictated by uniconf and append the respective line
                        if (uniconf.settings[i][0] != "ownerid" && uniconf.settings[i][0] != "smtpssl" && uniconf.settings[i][0] != "imapssl") {
                            confSettings += "   \"" + uniconf.settings[i][0] + "\": \"" + req.fields[uniconf.settings[i][0]] + "\",\n"
                        } else if (uniconf.settings[i][0] == "smtpssl" || uniconf.settings[i][0] == "imapssl") {
                            confSettings += "   \"" + uniconf.settings[i][0] + "\": " + req.fields[uniconf.settings[i][0]] + ",\n"
                        } else {
                            getOwner(req.fields.token).then(result => { // Get owner
                                if (Array.isArray(result)) {
                                    owner = []
                                    for (i in result) {
                                        owner.push(`"${result[i]}"`)
                                    }
                                    owner = "[" + owner + "]"
                                } else {
                                    owner = "\"" + result + "\""
                                }
                                confSettings += "   \"ownerid\": " + owner + "\n" // There's no comma after this, we know it because getting the owner ID is comparatively slow to writing the rest of the conf
                                fs.writeFile(path.join(__dirname, '..', 'configs', 'confinterim.json'), "{\n" + confSettings + "}", function (err) { // Write conf interim file, we do it on this line so that the owners are also saved
                                    if (err) throw err; else resolve("OK")
                                })
                            }).catch(err => log.error(err))
                        }
                    }
                }).catch(err => {
                    res.status(200);
                    res.json({
                        response: err
                    })
                })
            }).catch(err => {
                if (err.toString().includes("ERR_INVALID_URL")) { // The Redis library here is not very consistent and can end up leaving issues up to the caller for stupid reasons.
                    res.status(200);
                    res.json({
                        response: "INVALID_URL"
                    })
                } else if (err.toString().includes("Invalid pathname")) {
                    res.status(200);
                    res.json({
                        response: "BAD_DATABASE"
                    })
                } else { // ^^ As a result, any other error needs to be sent *back* to the caller, even if it's not one we expected
                    res.status(200);
                    res.json({
                        response: err,
                        hostname: req.fields.hostname,
                        redishostname: req.fields.redishostname,
                        database: req.fields.database,
                        dbusername: req.fields.dbusername
                    })
                }
            })
        }).catch(err => {
            res.status(200);
            res.json({
                response: err,
                hostname: req.fields.hostname,
                redishostname: req.fields.redishostname,
                database: req.fields.database,
                dbusername: req.fields.dbusername
            })
        })
    })
}

module.exports = createConf