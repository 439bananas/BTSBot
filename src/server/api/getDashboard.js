/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getDashboard.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router, json } from 'express';
import validateConf from '../validateConf.js';
import getGuilds from '../../core/getUserGuilds.cjs';
import getGuild from '../../core/getGuild.cjs';
import getUserPermissions from '../../core/getUserPermissions.cjs';
import botInGuild from '../../core/checkBotInGuild';
import isMod from '../../core/getUserModStatus.cjs';
import { getDashSchema } from './getDashboardSchema';
import getUserLang from '../../core/getUserLang';
const router = Router()
const jsonParser = json()
const schema = (await getDashSchema()).menus
void schema

async function getChannels(guildId) {
    try {
        let rawResponse = await fetch('https://discord.com/api/v10/guilds/' + guildId + "/channels", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${conf.token}`
            }
        })
        let response = await rawResponse.json()
        return response
    } catch (err) {
        throw err
    }
}

router.get('/*', async (req, res, next) => { // Get all dashboard settings
    let url = req.url.split('/')
    let re = await validateConf()

    async function getDash(request) {
        if (re.confExists) {
            if (!request.user.id) {
                return ({ error: "LOGIN_REQUIRED" }) // If no user then require login
            } else {
                try {
                    let guilds = await getGuilds(request.cookies.discordbearertoken) // Get guild in question
                    let guild = await getGuild(url[1], guilds, await isMod(request.user.id))

                    let icon
                    if (guild.icon == null) {
                        icon = 'https://cdn.discordapp.com/embed/avatars/' + Math.abs((guild.id >> 22) % 6) + ".png"
                    } else {
                        icon = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon
                    }

                    let permissions = getUserPermissions(guild)

                    if (!(permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD")) && !(await isMod(request.user.id))) { // Mandate that the user has the correct permissions
                        return { error: "MISSING_PERMS" }
                    } else {
                        let inGuild = await botInGuild(guild.id, true)
                        if (!inGuild) {
                            return { error: "BOT_NOT_IN_GUILD" } // Send error if the bot is not in the guild
                        } else {
                            let dashboardSettings = await MySQLConnection.query("SELECT * FROM GuildConfig WHERE id=?", [guild.id]) // If all good but there is no entry in Redis, try and get the guild from the database
                            if (dashboardSettings[0][0]) { // If there is a guild, return it and store in Redis
                                let JSONSettings = JSON.parse(dashboardSettings[0][0]["config"])
                                redisConnection.json.set('Dashboard:' + guild.id, '$', JSONSettings) // Cache dashboard settings
                                return { name: guild.name, config: JSONSettings, icon: icon, channels: await getChannels(guild.id), roles: inGuild.roles }
                            } else {
                                let newDashboardSettings = await MySQLConnection.query("INSERT INTO GuildConfig (id, config) VALUES (?, \"{}\")", [guild.id]) // If no guild, create one and return it
                                void newDashboardSettings
                                let newFetchedDashboardSettings = await MySQLConnection.query("SELECT * FROM GuildConfig WHERE id=?", [guild.id])
                                let JSONNewSettings = JSON.parse(newFetchedDashboardSettings[0][0]["config"])
                                redisConnection.json.set('Dashboard:' + guild.id, '$', JSONNewSettings) // Cache new dashboard settings
                                return { name: guild.name, config: JSONNewSettings, icon: icon, channels: await getChannels(guild.id), roles: inGuild.roles } // GET ROLES AND CHANNELS
                            }
                        }
                    }
                } catch (err) {
                    if (err.name == "RATE_LIMIT_REACHED") { // Perform same process when we are allowed to if we reach ratelimit
                        setTimeout(async () => {
                            return await getDash(req)
                        }, err.timeout * 1000)
                    }
                    switch (err) {
                        case "BAD_DISCORD_BEARER_TOKEN":
                            return ({ error: "LOGIN_REQUIRED" }) // If bad bearer token, mandate login
                        case "CANNOT_CONNECT_TO_DISCORD": // Cannot connect to Discord should require a wall
                            return ({ error: "CANNOT_CONNECT_TO_DISCORD" })
                        default:
                            log.error(err)
                            return ({ error: err })
                    }
                }
            }

        } else {
            return ({ error: "NO_CONF" })
        }
    }

    let dashboard = await getDash(req, res)
    res.status(200).json(dashboard)
})

router.post('/*', jsonParser, async (req, res, next) => {
    let url = req.url.split('/')
    let re = await validateConf()

    async function setDash(request) {
        if (re.confExists) {
            if (!request.user.id) {
                return ({ error: "LOGIN_REQUIRED" }) // If no user then require login
            } else {
                let lang = await getUserLang(req)
                try {
                    let message = ""
                    let guilds = await getGuilds(request.cookies.discordbearertoken) // Get guild in question
                    let guild = await getGuild(url[1], guilds, await isMod(request.user.id))
                    let permissions = getUserPermissions(guild)

                    if (!(permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD")) && !(await isMod(request.user.id))) { // Mandate that the user has the correct permissions
                        return { error: "MISSING_PERMS" }
                    } else {
                        let inGuild = await botInGuild(guild.id, true)
                        if (!inGuild) {
                            return { error: "BOT_NOT_IN_GUILD" } // Send error if the bot is not in the guild
                        } else {
                            const { category, menu, config } = req.body // Let's break apart the incoming state
                            // Only getting the category means that we don't have potential funky conflicts when we have a user who is missing two values in two different menus
                            let requiredMissing = {}
                            let wrongTypes = {}
                            Object.keys(config[category][menu]).map(async ind => {
                                let schemaColIdentifier
                                if (schema[category].schema[menu]["column-schema"]) { // Determine whether we should use the column name or column-schema when getting the settings from schema
                                    schemaColIdentifier = "column-schema"
                                } else {
                                    schemaColIdentifier = ind
                                }

                                Object.keys(schema[category].schema[menu][schemaColIdentifier]).map(setting => {
                                    function formulateErrors(setSetting, sch, rowIndex) { // Let's formulate the errors regarding missing and wrong types
                                        if (((!setSetting && !sch.default) || setSetting === "" && sch.default) && sch.required) { // If a setting is missing and it's required (in the shown view), throw a fit
                                            if (!requiredMissing[ind]) requiredMissing[ind] = [] // Missing options that are required
                                            if (!rowIndex) {
                                                requiredMissing[ind].push(translate(lang, sch.title))
                                            } else {
                                                requiredMissing[ind].push({ title: translate(lang, sch.title), index: rowIndex })
                                            }
                                        } else if ((setSetting === undefined || setSetting === null) && sch.default) { // If option not required check its type
                                            let correctType = true
                                            switch (sch.type) {
                                                case "shortText":
                                                    if (setSetting && (typeof (setSetting) != "string" || setSetting.includes("\n"))) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "longText":
                                                    if (typeof (setSetting) != "string" && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "checkbox":
                                                    if (typeof (setSetting) != "object" && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "radio":
                                                    if (typeof (setSetting) != "string" && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "integer":
                                                    if (parseInt(setSetting) != setSetting && setSetting) { // If we parse any other type (aside from number) as int, then we get NaN, and NaN is literally equal to nothing (not even itself!)
                                                        correctType = false
                                                    }
                                                    break;
                                                case "number":
                                                    if (parseFloat(setSetting) != setSetting && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "dropdown":
                                                    if (typeof (setSetting) != "string" && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "role":
                                                    if (typeof (setSetting) != "string" && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                                case "channel":
                                                    if (typeof (setSetting) != "string" && setSetting) {
                                                        correctType = false
                                                    }
                                                    break;
                                            }

                                            if (!correctType) { // If it's known not to be the correct type then fall into this clause annd add the item to this object
                                                if (!wrongTypes[ind]) wrongTypes[ind] = []
                                                if (!rowIndex) {
                                                    wrongTypes[ind].push(translate(lang, sch.title))
                                                } else {
                                                    if (!wrongTypes[ind]) wrongTypes[ind] = []
                                                    wrongTypes[ind].push({ title: translate(lang, sch.title), index: rowIndex })
                                                }
                                            }
                                        }
                                    }

                                    if (setting != "new" && setting != "row-schema" && setting != "deleteColumnHeader" && setting != "deleteColumnBody") { // Oh how we love quadratic time complexity
                                        let setSetting = config[category][menu][ind][setting]
                                        formulateErrors(setSetting, schema[category].schema[menu][schemaColIdentifier][setting])
                                    } else if (setting == "row-schema") { // Formulate the errors for however many rows we have
                                        Object.keys(config[category][menu][ind].rows).forEach(rowIndex => {
                                            Object.keys(schema[category].schema[menu]["column-schema"]["row-schema"]).map(rowSetting => {
                                                formulateErrors(config[category][menu][ind].rows[rowIndex][rowSetting], schema[category].schema[menu]["column-schema"]["row-schema"][rowSetting], rowIndex)
                                            })
                                        })
                                    }
                                })
                            })

                            Object.keys(requiredMissing).map(item => { // Now let's build the actual messages
                                if (schema[category].schema[menu]["column-schema"]) {
                                    requiredMissing[item].map(missingSetting => {
                                        if (typeof (missingSetting) == "object") {
                                            if (!message) {
                                                message = missingSetting.title + translate(lang, "page_dashboardrequiredsettingcolrowschemamissingpart1") + (parseInt(item) + 1) + translate(lang, "page_dashboardrequiredsettingcolrowschemamissingpart2") + (parseInt(missingSetting.index) + 1) + translate(lang, "page_dashboardrequiredsettingcolrowschemamissingpart3")
                                            } else {
                                                message += "\n" + missingSetting.title + translate(lang, "page_dashboardrequiredsettingcolrowschemamissingpart1") + (parseInt(item) + 1) + translate(lang, "page_dashboardrequiredsettingcolrowschemamissingpart2") + (parseInt(missingSetting.index) + 1) + translate(lang, "page_dashboardrequiredsettingcolrowschemamissingpart3")
                                            }
                                        } else {
                                            if (!message) {
                                                message = missingSetting + translate(lang, "page_dashboardrequiredsettingcolschemamissingpart1") + (parseInt(item) + 1) + translate(lang, "page_dashboardrequiredsettingcolschemamissingpart2")
                                            } else {
                                                message += "\n" + missingSetting + translate(lang, "page_dashboardrequiredsettingcolschemamissingpart1") + (parseInt(item) + 1) + translate(lang, "page_dashboardrequiredsettingcolschemamissingpart2")
                                            }
                                        }
                                    })
                                } else {
                                    requiredMissing[item].map(missingSetting => {
                                        if (!message) {
                                            message = missingSetting + translate(lang, "page_dashboardrequiredsettingnocolschemamissing")
                                        } else {
                                            message += "\n" + missingSetting + translate(lang, "page_dashboardrequiredsettingnocolschemamissing")
                                        }
                                    })
                                }
                            })

                            if (Object.keys(wrongTypes)[0]) {
                                return { error: "WRONG_TYPES" }
                            } else {
                                if (message) {
                                    return { message: message }
                                } else {
                                    log.temp("SAVE CONFIG!!!")
                                }
                            }
                        }
                    }
                } catch (err) {
                    if (err.name == "RATE_LIMIT_REACHED") { // Perform same process when we are allowed to if we reach ratelimit
                        setTimeout(async () => {
                            return await setDash(req)
                        }, err.timeout * 1000)
                    }
                    switch (err) {
                        case "BAD_DISCORD_BEARER_TOKEN":
                            return ({ error: "LOGIN_REQUIRED" }) // If bad bearer token, mandate login
                        case "CANNOT_CONNECT_TO_DISCORD": // Cannot connect to Discord should require a wall
                            return ({ error: "CANNOT_CONNECT_TO_DISCORD" })
                        default:
                            log.error(err)
                            return ({ error: err })
                    }
                }
            }

        } else {
            return ({ error: "NO_CONF" })
        }
    }

    let dashboard = await setDash(req, res)
    res.status(200).json(dashboard)

    // Enforce login
    // Throw error if user not mod and user has no manage server perms in said server
    // Go on to validate config
})

export default router;