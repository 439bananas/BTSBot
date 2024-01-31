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

function Dashboard(props) {
    function getDashboardSchema() { // useEffect to get all guilds the user is a part of
        const [dashboardSchema, setDashboardSchema] = useState(null)

        useEffect(() => {
            console.log("call")
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
            returnedElement = <Categories cats={schema.itemDescriptions} language={props.language} id={url[2]} />
        } else {
            console.log()
            console.log(url[3])
            console.log(schema.items[decodeURIComponent(url[3])])
            if (schema.items[decodeURIComponent(url[3])]) { // Decode the URI so that we actually recognise it
                returnedElement = JSON.stringify(schema.items[decodeURIComponent(url[3])])
            } else {
                returnedElement = "404"
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