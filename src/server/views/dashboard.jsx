/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: dashboard.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react');

function Dashboard(props) {
    return (
        <div className="global-intro-section">
            <div className="container">
                <center>
                    <h1>{props.guild.name}</h1>
                    <div style={{ paddingTop: 2 + "ex" }} />
                    <img src={props.guild.icon} className="rounded-circle dashboard-guild-icon" />
                </center>
            </div>
        </div>
    )
}

module.exports = Dashboard