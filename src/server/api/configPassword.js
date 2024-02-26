/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: configPassword.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
import { hash, verify } from 'argon2';
const router = Router();
import { randomBytes, createHash } from 'crypto';
import { existsSync, mkdirSync, writeFile, readFileSync } from 'fs';
import { formidable } from 'formidable';
import validateConf from '../validateConf';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const symbols = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const capitalLetters = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
const lowercaseLetters = /[abcdefghijklmnopqrstuvwxyz]/;
const numbers = /[1234567890]/;
let form
let tokens

router.get('/', async (req, res) => { // Endpoint exists to see if there is a password configured
    if (existsSync(path.join(__dirname, '..', 'configs', 'configpasswordhash.json'))) {
        let configPasswordFile = (await import('../../../configs/configpasswordhash.json', { assert: { type: "json" } })).default
        if (configPasswordFile.passwordhash) {
            res.json({ passwordExists: true }) // If there is such a file *and* there is passwordhash as a property, then there exists a password, else no
        } else {
            res.json({ passwordExists: false })
        }
    } else {
        res.json({ passwordExists: false })
    }
})

router.post('/create', async (req, res, next) => { // Allows a user to set a configuration password if it does not exist
    let re = await validateConf(req)

    let passwordHash = undefined
    let sha256token
    let token
    let passwordExists = false
    if (existsSync(path.join(__dirname, '..', 'configs', 'configpasswordhash.json'))) {
        let configPasswordFile = (await import('../../../configs/configpasswordhash.json', { assert: { type: "json" } })).default
        if (configPasswordFile.passwordhash) {
            passwordExists = true // If there is such a file *and* there is passwordhash as a property, then there exists a password, else no
        }
    }

    try {
        if (passwordExists) { // If there already is a valid password, throw a "PASSWORD_EXISTS" error
            res.json({ error: "PASSWORD_EXISTS" })
        } else if (re.confExists || re.confErr == "CANNOT_CONNECT_TO_DISCORD") {
            res.json({ error: "CONF_OK" }) // If conf is ok, you shouldn't be able to set a new password if there isn't a password
        } else {
            form = formidable({ maxFields: Infinity }) // Prepare the form

            form.parse(req, async (err, fields) => {
                if (err) {
                    log.error(err.toString())
                    return
                } else if (!fields) {
                    res.json({ error: "MISSING_FIELDS" }) // If no fields then complain, don't crash
                } else {
                    if (!fields.password || !fields.passwordrepeat) { // Ensure that there are both passwords
                        res.json({ error: "MISSING_FIELDS" })
                    } else if (!(fields.password[0].length >= 12 && symbols.test(fields.password[0]) && lowercaseLetters.test(fields.password[0]) && capitalLetters.test(fields.password[0]) && numbers.test(fields.password[0]))) { // Enforce password requirements; one uppercase letter, one lowercase, one number, one symbol and twelve characters
                        res.json({ error: "PASSWORD_REQIREMENTS_NOT_MET" })
                    } else if (fields.password[0] != fields.passwordrepeat[0]) { // Ensure that the passwords match
                        res.json({ error: "NON_MATCHING_PASSWORDS" })
                    } else {
                        if (!existsSync(path.join(__dirname, '..', 'configs'))) {
                            mkdirSync(path.join(__dirname, '..', 'configs'))
                        }

                        token = randomBytes(64).toString('base64') // Generate random characters and put them in base 64
                        sha256token = createHash('sha256').update(token).digest('hex')
                        passwordHash = await hash(fields.password[0], { memoryCost: 2 ** uniconf.hashmemorycost, timeCost: uniconf.defaulthashingrounds }) // Hash the given password (salt is given in hash)
                        writeFile(path.join(__dirname, '..', 'configs', 'configpasswordhash.json'), `{"passwordhash": "${passwordHash}"}`, function (err) { // Store the hashed password
                            if (err) throw err;
                        })
                        writeFile(path.join(__dirname, '..', 'configs', 'logintokens.json'), `{"tokens": ["${sha256token}"]}`, function (err) { // Store the hashed token
                            if (err) throw err;
                        })
                        res.cookie('configtoken', token, { maxAge: 3600000, httpOnly: true }) // Set a cookie for the configuration token, it lasts for an hour
                        res.json({ message: "OK" })
                    }
                }
            })
        }
    } catch (err) {
        log.error(err.toString)
        res.json({ error: "UNKNOWN_ERROR" })
    }
})

router.post('/submit', async (req, res, next) => { // Allows user to submit a configuration password
    let newTokens
    let token
    let sha256token
    tokens = undefined
    if (!existsSync(path.join(__dirname, '..', 'configs', 'configpasswordhash.json'))) { // Does password exist? If not, scream at user
        res.json({ error: "NO_PASSWORD_CONFIGURED" })
    } else {
        const configPasswordFile = (await import('../../../configs/configpasswordhash.json', { assert: { type: "json" } })).default
        if (configPasswordFile.passwordhash) {
            try {
                form = formidable({ maxFields: Infinity }) // Prepare the form

                form.parse(req, async (err, fields) => {
                    if (err) {
                        log.error(err.toString())
                        return
                    } else if (!fields) {
                        res.json({ error: "MISSING_FIELDS" }) // If missing fields then give error
                    } else if (!fields.password) {
                        res.json({ error: "MISSING_FIELDS" })
                    } else {
                        if (!(await verify(configPasswordFile.passwordhash, fields.password[0]))) { // If incorrect password then auth has failed
                            res.json({ error: "AUTH_FAILED" })
                        } else { // This should happen if auth succeeds
                            token = randomBytes(64).toString('base64') // Generate random characters and put them in base 64
                            sha256token = createHash('sha256').update(token).digest('hex')
                            try {
                                let tokensFile = (readFileSync(path.join(__dirname, '..', 'configs', 'logintokens.json'), "utf8", function (err) { // Read, don't import, so that login tokens are updated live
                                    if (err) {
                                        throw err;
                                    }
                                }))
                                tokens = JSON.parse(tokensFile)
                            } catch (err) { // If failure with fs, log the error and assume there are no tokens
                                tokens = { tokens: [] }
                                console.error(err)
                            }
                            newTokens = `{"tokens": [`
                            for (let originalToken of tokens.tokens) { // Enumerate through tokens to add them all to the list again
                                newTokens += `"${originalToken}", `
                            }
                            newTokens += `"${sha256token}"]}`
                            writeFile(path.join(__dirname, '..', 'configs', 'logintokens.json'), newTokens, function (err) { // Store the new hashed token
                                if (err) throw err;
                            })
                            res.cookie('configtoken', token, { maxAge: 3600000, httpOnly: true }) // Set a cookie for the configuration token, it lasts for an hour
                            res.json({ message: "OK" })
                        }
                    }
                })
            } catch (err) {
                log.error(err.toString)
                res.json({ error: "UNKNOWN_ERROR" })
            }
        } else {
            res.json({ error: "NO_PASSWORD_CONFIGURED" }) // If no password configured, scream at user
        }
    }
})

export default router;