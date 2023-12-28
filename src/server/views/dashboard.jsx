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

const { useState, useEffect } = require('react');
const React = require('react');
const { Routes, Route, useLocation, Link } = require('react-router-dom');
const Categories = require('./categories');

function Dashboard(props) {
    function getDashboardSchema() { // useEffect to get all guilds the user is a part of
        const [dashboardSchema, setDashboardSchema] = useState(null)

        useEffect(() => {
            async function fetchDashboardSchema() {
                let rawResponse = await fetch("/api/dashboard-schema") // Fetch dashboard
                let response = await rawResponse.json()
                setDashboardSchema(response)
            }

            fetchDashboardSchema()
        }, [])

        return dashboardSchema
    }
    const location = useLocation()
    let url = location.pathname.split('/')
    let returnedElement

    let schema = getDashboardSchema()

    if (!url[3]) {
        returnedElement = <Categories cats={schema} language={props.language} />
    }

    return (
        <div>
            <div className="global-intro-section">
                <div className="container">
                    <center>
                        <h1>{props.guild.name}</h1>
                        <div style={{ paddingTop: 2 + "ex" }} />
                        <img src={props.guild.icon} className="rounded-circle dashboard-guild-icon" />
                    </center>
                </div>
            </div>
            {returnedElement}
        </div>
    )
}

module.exports = Dashboard