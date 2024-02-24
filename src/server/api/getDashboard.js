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
import validateConf from '../validateConf.cjs';
import getGuilds from '../../core/getUserGuilds.cjs';
import getGuild from '../../core/getGuild.cjs';
import getUserPermissions from '../../core/getUserPermissions.cjs';
import botInGuild from '../../core/checkBotInGuild';
import isMod from '../../core/getUserModStatus.cjs';
import { getDashSchema } from './getDashboardSchema';
import getUserLang from '../../core/getUserLang';
const router = Router()
const jsonParser = json()

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

                    let permissions = await getUserPermissions(guild)

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
                try {
                    let guilds = await getGuilds(request.cookies.discordbearertoken) // Get guild in question
                    let guild = await getGuild(url[1], guilds, await isMod(request.user.id))

                    let permissions = await getUserPermissions(guild)

                    if (!(permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD")) && !(await isMod(request.user.id))) { // Mandate that the user has the correct permissions
                        return { error: "MISSING_PERMS" }
                    } else {
                        let inGuild = await botInGuild(guild.id, true)
                        if (!inGuild) {
                            return { error: "BOT_NOT_IN_GUILD" } // Send error if the bot is not in the guild
                        } else {
                            //console.log(req.body)
                            const schema = await getDashSchema() 
                            //console.log(schema)
                            // Get dashboard schema
                            Object.keys(req.body).map(category => {
                                Object.keys(req.body[category]).map(menu => {
                                    console.log(menu)
                                    Object.keys(req.body[category][menu]).map(async ind => {
                                            console.log(req.body[category][menu][ind])
                                        ///console.log(req.body[category][menu])
                                        //console.log(req.body[category][menu][ind])
                                        console.log(await getUserLang(req))
                                    })
                                })
                            })
                            try {
                                let int = parseInt("abc")
                                let int2 = parseInt(12.3)
                                let int3 = parseInt("12.3")
                                console.log(int)
                                console.log(int2)
                                console.log(int3)
                                console.log(int === NaN)
                            } catch (err) {
                                log.temp(err)
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