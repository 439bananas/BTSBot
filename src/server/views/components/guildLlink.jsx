/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: guildLink.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react');
const { Link } = require('react-router-dom');

function GuildLink(props) {
    let guildIconLink

    if (props.guild.icon == null) {
        guildIconLink = 'https://cdn.discordapp.com/embed/avatars/' + Math.abs((props.guild.id >> 22) % 6) + ".png"
    } else {
        guildIconLink = "https://cdn.discordapp.com/icons/" + props.guild.id + "/" + props.guild.icon
    }

    let guildIconClass
    if (props.botPresences[props.guild.id]) {
        guildIconClass = "guild-link"
    } else {
        guildIconClass = "guild-link guild-bot-not-in"
    }

    return (
        <div className="guild">
            <Link to={"/servers/" + props.guild.id} className={guildIconClass} >
                <img src={guildIconLink} className="rounded-circle guild-icon" />
                <br />
                <p className="guild-link">
                    {props.guild.name}
                </p>
            </Link>
        </div>)
}

module.exports = GuildLink