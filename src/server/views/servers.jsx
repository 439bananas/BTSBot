/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: servers.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const ConfLayout = require('./components/conf-layout');
const translate = require('../../core/getLanguageString');
const botInGuild = require('../../core/checkBotInGuild');
let guildIconLink;

function Guilds() { // I keep forgetting I can't do async functions in JSX
    let guildElements = []

    for (guildIndex in listedGuilds) {
        let guild = listedGuilds[guildIndex]
        if (guild.icon == null) {
            guildIconLink = 'https://cdn.discordapp.com/embed/avatars/' + Math.abs((guild.id >> 22) % 5) + ".png"
        } else {
            guildIconLink = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon
        }
            if (guildsBotIsIn[guildIndex] === true) {
                guildElements.push(<div className="guild"><a href={"/servers/" + guild.id} className="guild-link"><img src={guildIconLink} className="rounded-circle guild-icon" /><br /><p className="guild-link">{guild.name}</p></a></div>)
            } else {
                guildElements.push(<div className="guild"><a href={"/servers/" + guild.id} className="guild-link guild-bot-not-in"><img src={guildIconLink} className="rounded-circle guild-icon" /><br /><p className="guild-link">{guild.name}</p></a></div>)
            }

        
    }

    if (!guildElements[0]) {
        guildElements = <div className="no-guilds">{translate(lang, "page_noguildstolist")}</div> // This element is in bold, strong quotes manipulate text to speech, while bold is for purely aesthetic purposes
    }
    return guildElements
};

<ConfLayout>
    <div className="global-intro-section">
        <div className="container">
            <center><h1>{translate(lang, "page_globalservers")}</h1></center>
        </div>
    </div>
    <div className="container">
        <div className="guild-list flex-wrap">
            <Guilds />
        </div>
    </div>
</ConfLayout>