/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: servers.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react');
const { useEffect, useState } = require('react');
const translate = require('./components/getLanguageString');
const GuildLink = require('./components/guildLlink');
const { Routes, Route } = require("react-router-dom");
const Server = require('./server')

function getGuilds() { // useEffect to get all guilds the user is a part of
    const [guilds, setGuilds] = useState(null)

    useEffect(() => {
        async function fetchGuilds() {
            let rawResponse = await fetch("/api/user/guilds") // Fetch all guilds
            let response = await rawResponse.json()
            setGuilds(response)
        }

        fetchGuilds()
    }, [])

    return guilds
}

function botInGuild(guild) { // useEffect to get all guilds the user is a part of
    const [presence, setPresence] = useState(null)

    useEffect(() => {
        async function fetchPresence() {
            let rawResponse = await fetch("/api/guild-presence", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guilds: guild }) }) // Fetch guild presences
            let response = await rawResponse.json()
            setPresence(response)
        }

        fetchPresence()
    }, [])

    return presence
}

function ListGuilds(props) {
    let listedGuildIds = []
    let listedGuilds = []
    props.guilds.guilds.forEach(guild => {
        let reversedPermsInt = parseInt(guild.permissions).toString(2).split("")
        reversedPermsInt = reversedPermsInt.reverse() // Sadly no way to reverse strings, sad
        if (reversedPermsInt[3] == 1 || reversedPermsInt[5] == 1) { // There's no point in rejoining the array back together, working on it like this is fiiiine
            listedGuilds.push(guild) // User must be administrator or have manage server permissions for their server to show up in the list
            listedGuildIds.push(guild.id) // Compile list of guild IDs to check
        }
    })

    let botPresences = botInGuild(listedGuildIds)

    function showGuildElements() {
        let guildElements = null
        if (botPresences != null) {
            listedGuilds.sort((a, b) => { // Sort the list into A-Z of guild name
                const nameA = a.name.toUpperCase(); // Thanks MDN! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });

            let key = 0
            guildElements = []
            listedGuilds.forEach(guild => { // Add each listed guild to the list
                guildElements.push(<GuildLink key={key++} guild={guild} botPresences={botPresences.botInGuild} />)
            })

            if (!guildElements[0]) {
                guildElements = <div className="no-guilds">{translate(props.language, "page_noguildstolist")}</div> // This element is in bold, strong quotes manipulate text to speech, while bold is for purely aesthetic purposes
            }

            return guildElements
        } else return null
    }

    let sGE = showGuildElements()
    if (sGE === null) {
        return null // I was trying to get it to return null if content is still loading :(
    } else return sGE
}

function GetGuilds(props) { // Get all guilds that the user can manage
    let guildElements
    let GuildList = <ListGuilds guilds={props.guilds} language={props.language} />
    if (GuildList !== null) {
        guildElements = <div>
            <div className="global-intro-section">
                <div className="container">
                    <center><h1>{translate(props.language, "page_globalservers")}</h1></center>
                </div>
            </div>
            <div className="container">
                <div className="guild-list flex-wrap">
                    {GuildList}
                </div>
            </div>
        </div>
    } else guildElements = null

    return guildElements
};

function ServersList(props) { // Show the servers list
    let guilds = getGuilds()
    if (typeof (document) != "undefined") {
        document.title = props.uniconf.projname + " - " + translate(props.language, "page_globalservers")
    }
    if (!props.user.id) {
        if (typeof (window) != "undefined") {
            window.location.href = "/login?bypasscache=true"
        }
        return null
    } else if (guilds === null) return null // If there is not yet a response then return a loading screen
    else return (<GetGuilds language={props.language} guilds={guilds} />)
}

function Servers(props) {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<ServersList language={props.language} uniconf={props.uniconf} user={props.user} />} />
                <Route path="*" element={<Server user={props.user} addToServerLink={props.addToServerLink} language={props.language} uniconf={props.uniconf} />} />
            </Route>
        </Routes>
    )
}

module.exports = Servers