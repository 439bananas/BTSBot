/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: dashboard-category.jsx               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')
const { Link, useLocation } = require('react-router-dom')
const translate = require('./components/getLanguageString')

function DashboardCategory(props) {
    let { schema, lang } = props
    const location = useLocation()
    let url = location.pathname.split('/')
    let dashSchema = schema.items[decodeURIComponent(url[3])].schema
    let menuHeader = []
    let currentlySelected
    let style = {}
    let key = 0

    if (url[4] && Object.keys(dashSchema).includes(url[4]) && typeof (dashSchema[url[4]]) == "object") { // The amount of swearing I have to do at CSS is unbelievable here
        if (dashSchema[url[4]]["title"]) {
            currentlySelected = url[4]
        }
    }

    if (Object.keys(dashSchema).includes(dashSchema.defaultMenu) && typeof (dashSchema[dashSchema.defaultMenu]) == "object") {
        if (dashSchema[dashSchema.defaultMenu]["title"]) {
            if (!currentlySelected) {
                currentlySelected = dashSchema.defaultMenu
            }
            if (currentlySelected == dashSchema.defaultMenu) { // This exists as a separate clause, since the user could explicitly be setting the default as "currently selected"
                style = { borderBottomStyle: "solid", borderColor: "#f0600f", padding: 6 + "px " + 6 + "px " + 3 + "px " + 6 + "px" }
            }
            menuHeader.push(
                <Link
                    className="dashboard-menu-link"
                    style={style}
                    id={dashSchema.defaultMenu}
                    to={url[2] + "/" + url[3] + "/" + dashSchema.defaultMenu}
                    key={key++}>
                    {translate(lang, dashSchema[dashSchema.defaultMenu].title)}
                </Link>
            ) // Show the default link first
        }
    }

    for (menuKey of Object.keys(dashSchema)) { // Add the rest of the menus, as long as each one is an object
        if (menuKey != dashSchema.defaultMenu && typeof (dashSchema[menuKey]) == "object") {
            console.log(menuKey)
            console.log(dashSchema[menuKey])
            if (currentlySelected == menuKey) {
                style = { borderBottomStyle: "solid", borderColor: "#f0600f", padding: 6 + "px " + 6 + "px "+  3 + "px " + 6 + "px" } // Add the bottom border if currently selected
            } else style = {}
            menuHeader.push(
                <Link
                    className="dashboard-menu-link"
                    style={style}
                    id={menuKey}
                    to={url[2] + "/" + url[3] + "/" + menuKey}
                    key={key++}>
                    {translate(lang, dashSchema[menuKey].title)}
                </Link>
            )
        }
    }

    return (
        <div id="dashboard-menu-list">
            <div className="container">
                {menuHeader}
            </div>
        </div>
    )
}

module.exports = DashboardCategory;