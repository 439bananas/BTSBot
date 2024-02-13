/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: dashboard.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { useState, useEffect } = require('react');
const React = require('react');
const { Routes, Route, useLocation, Link } = require('react-router-dom');
const Categories = require('./categories');
const DashboardCategory = require('./dashboard-category');

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
    let schema = getDashboardSchema()
    let returnedElement

    if (schema != null) {
        if (!url[3]) {
            returnedElement = <Categories cats={schema.itemDescriptions} language={props.language} id={url[2]} /> // Display list of categories if only in the top level server dashboard
        } else {
            if (schema.items[decodeURIComponent(url[3])]) { // Decode the URI so that we actually recognise it
                returnedElement = <DashboardCategory schema={schema} url={url} lang={props.language} guild={props.guild} />
            } else {
                window.location.href = "/servers/" + url[2] // If not recognised category, redirect up
            }
        }
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