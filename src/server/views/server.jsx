/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: server.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import getUserPermissions from '../../core/getUserPermissions.cjs' // I know I shouldn't be calling something in core but to be fair, the API doesn't call any sensitive functions
import translate from './components/getLanguageString.cjs'
import Dashboard from './dashboard'
import ErrorPage from './error-page-spa'

function getDashboard(id, all) { // useEffect to get all guilds the user is a part of
    const [dashboard, setDashboard] = useState(null)

    console.log(all)

    useEffect(() => {
        async function fetchDashboard() {
            if (all) {
                let rawResponse = await fetch("/api/global-dashboard/" + id) // Get dashboard settings (this endpoint can only be called by moderators)
                let response = await rawResponse.json()
                setDashboard(response)
            } else {
                let rawResponse = await fetch("/api/dashboard/" + id) // Fetch dashboard
                let response = await rawResponse.json()
                setDashboard(response)
            }

        }

        fetchDashboard()
    }, [])

    return dashboard
}

function Server(props) {
    const location = useLocation()
    let url = location.pathname.split('/')
    let guild = getDashboard(url[2], url[1] == "all-servers")

    if (typeof (document) != "undefined" && guild != null) {
        document.title = props.uniconf.projname + " - " + guild.name
    }

    if (guild != null && typeof (guild.error) != "undefined") {
        switch (guild.error) {
            case "LOGIN_REQUIRED": // Redirect to login if not logged in
                if (typeof (window) != "undefined") {
                    window.location.href = "/login?returnto=" + encodeURIComponent(location.pathname.substring(1))
                }
                return null
            case "MISSING_PERMS": // Redirect to servers if user not in guild or has no perms
                if (typeof (window) != "undefined") {
                    window.location.href = "/servers"
                }
                return null
            case "BOT_NOT_IN_GUILD": // If bot not in guild then redirect to Discord OAuth2
                if (typeof (window) != "undefined") {
                    let addServerUrl = ("https://discord.com/oauth2/authorize?client_id=" + props.addToServerLink.clientid + "&permissions=" + props.uniconf.perms + "&redirect_uri=" + encodeURIComponent(props.addToServerLink.address + "/login") + "&state=" + encodeURIComponent("servers/" + url[2]) + "&guild_id=" + url[2] + "&disable_guild_select=true&response_type=code&scope=guilds%20email%20identify%20bot%20applications.commands")
                    window.location.href = addServerUrl
                }
                return null
            case "CANNOT_CONNECT_TO_DISCORD":
                if (typeof (window) != "undefined") {
                    window.location.href = "/"
                }
                return null
            default:
                return <ErrorPage language={props.language} error={translate(props.language, "page_confunknownerror")} diag={translate(props.language, "page_confunknownerrordiagspa")} errorInfo={guild.error} />
        }
    } else {
        if (guild != null) {
            return <Dashboard language={props.language} guild={guild} />
        } else return null
    }

}

export default Server