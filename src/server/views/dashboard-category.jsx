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

import { useState } from 'react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import translate from './components/getLanguageString.cjs'
import DashboardMenu from './dashboard-menu'

function DashboardCategory(props) {
    let { schema, lang } = props
    const location = useLocation()
    let url = location.pathname.split('/')
    let dashSchema = schema.items[decodeURIComponent(url[3])].schema
    let key = 0
    let currentlySelected
    let style = {}

    const [disabledMenu, setDisabledMenu] = useState({});
    const [disabledSelectedMenu, setDisabledSelectedMenu] = useState({ borderBottomStyle: "solid", borderColor: "#f0600f", padding: 6 + "px " + 6 + "px " + 3 + "px " + 6 + "px" });

    let menuHeader = [<Link
        className="dashboard-menu-link"
        id={dashSchema.defaultMenu}
        style={disabledMenu}
        to={url[2]}
        key={key++}>
        {translate(lang, "page_dashboardbackbutton")}
    </Link>]

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
                style = disabledSelectedMenu
            } else style = disabledMenu
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
            if (!currentlySelected) {
                currentlySelected = menuKey
            }
            if (currentlySelected == menuKey) {
                style = disabledSelectedMenu // Add the bottom border if currently selected
            } else style = disabledMenu
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
        <div>
            <div id="dashboard-menu-list">
                <div className="container">
                    {menuHeader}
                </div>
            </div>
            <div className="container">
                <DashboardMenu lang={lang} setStates={{ setDisabledMenu: setDisabledMenu, setDisabledSelectedMenu: setDisabledSelectedMenu }} schema={dashSchema[currentlySelected]} settings={props.guild} menu={currentlySelected} url={url} />
            </div>
        </div>
    )
}

export default DashboardCategory;