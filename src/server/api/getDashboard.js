/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getDashboard.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const pkg = require('../../../package.json')
const express = require('express');
const validateConf = require('../validateConf');
const getGuilds = require('../../core/getUserGuilds');
const getGuild = require('../../core/getGuild');
const getUserPermissions = require('../../core/getUserPermissions');
const botInGuild = require('../../core/checkBotInGuild');
const router = express.Router()

router.get('/*', async (req, res, next) => { // Get all dashboard settings
    let url = req.url.split('/')
    let re = await validateConf()
    async function getDash(request) {
        if (re.confExists) {
            if (!request.user.id) {
                return ({ error: "LOGIN_REQUIRED" }) // If no user then require login
            } else {
                try {
                    // GET GUILD ICON
                    let guilds = await getGuilds(request.cookies.discordbearertoken) // Get guild in question
                    let guild = await getGuild(url[1], guilds)
                    let icon
                    if (guild.icon == null) {
                        icon = 'https://cdn.discordapp.com/embed/avatars/' + Math.abs((guild.id >> 22) % 6) + ".png"
                    } else {
                        icon = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon
                    }

                    let permissions = await getUserPermissions(guild)
                    if (!(permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD"))) { // Mandate that the user has the correct permissions
                        return { error: "MISSING_PERMS" }
                    } else {
                        let inGuild = await botInGuild(guild.id, true)
                        if (!inGuild) {
                            return { error: "BOT_NOT_IN_GUILD" } // Send error if the bot is not in the guild
                        } else {
                            let cachedDashboardSettings = await redisConnection.json.get('Dashboard:' + guild.id) // Get what's stored in Redis if there is anything stored there
                            if (cachedDashboardSettings === null) {
                                let dashboardSettings = await MySQLConnection.query("SELECT * FROM GuildConfig WHERE id=?", [guild.id]) // If all good but there is no entry in Redis, try and get the guild from the database
                                if (dashboardSettings[0][0]) { // If there is a guild, return it and store in Redis
                                    let JSONSettings = JSON.parse(dashboardSettings[0][0]["config"])
                                    redisConnection.json.set('Dashboard:' + guild.id, '$', JSONSettings) // Cache dashboard settings
                                    return { name: guild.name, config: JSONSettings, icon: icon }
                                } else {
                                    let newDashboardSettings = await MySQLConnection.query("INSERT INTO GuildConfig (id, config) VALUES (?, \"{}\")", [guild.id]) // If no guild, create one and return it
                                    void newDashboardSettings
                                    let newFetchedDashboardSettings = await MySQLConnection.query("SELECT * FROM GuildConfig WHERE id=?", [guild.id])
                                    let JSONNewSettings = JSON.parse(newFetchedDashboardSettings[0][0]["config"])
                                    redisConnection.json.set('Dashboard:' + guild.id, '$', JSONNewSettings) // Cache new dashboard settings
                                    return { name: guild.name, config: JSONNewSettings, icon: icon }
                                }
                            } else {
                                return { name: guild.name, config: cachedDashboardSettings, icon: icon }
                            }
                        }
                    }
                } catch (err) {
                    if (err.name == "RATE_LIMIT_REACHED") { // Perform same process when we are allowed to if we reach ratelimit
                        setTimeout(async () => {
                            return await getDash(req)
                        }, timeout * 1000)
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

module.exports = router;