/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: createConf.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fs = require('fs')
const checkMySQL = require('./checkMySQL')
const checkDiscord = require('./checkDiscord')
const getOwner = require('./getOwnerID')
let confSettings
let owner

function createConf(req) { // Create interim conf so OAuth2 can be validated
    return new Promise(function (resolve, reject) {
        checkMySQL(req.fields.hostname, req.fields.dbusername, req.fields.dbpassword, req.fields.database).then(result => { // Check the given MySQL info
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
            res.status(200);
            res.json({
                response: err,
                hostname: req.fields.hostname
            })
        })
    })
}

module.exports = createConf