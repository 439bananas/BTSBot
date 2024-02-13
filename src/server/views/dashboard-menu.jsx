/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: dashboard-menu.jsx                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { useState, createElement } = require('react')
const React = require('react')
const translate = require('./components/getLanguageString')

// EDITING STATE NEEDS TO KILL LINKS UPSTREAM

function DashboardMenu(props) {
    let {lang} = props

    function killMenu() { // Prevent the menu list from being interacted with
        props.setStates.setDisabledSelectedMenu({ borderBottomStyle: "solid", borderColor: "#f0600f", padding: 6 + "px " + 6 + "px " + 3 + "px " + 6 + "px", pointerEvents: "none", color: "#888" })
        props.setStates.setDisabledMenu({ pointerEvents: "none", color: "#888" })
    }

    function enableMenu() { // Allow the menu list to be interacted with
        props.setStates.setDisabledSelectedMenu({ borderBottomStyle: "solid", borderColor: "#f0600f", padding: 6 + "px " + 6 + "px " + 3 + "px " + 6 + "px" })
        props.setStates.setDisabledMenu({})
    }

    console.log(props)

    let config = props.settings.config

    let [state, setState] = useState(JSON.parse(JSON.stringify(config))) // Doing it this way means that we don't have problems with pointers!!!
    let newStateG = JSON.parse(JSON.stringify(state))

    function GenerateColumnContents(props) {
        let { schema, config } = props
        console.log(props)
        return "c"
    }

    if (state[decodeURIComponent(props.url[3])]) {
        if (state[decodeURIComponent(props.url[3])][props.menu]) {
            console.log(state[decodeURIComponent(props.url[3])][props.menu])
            //console.log(props.schema)
            if (props.schema["column-schema"]) {
                // for each member of the config, generate a column with such contents
                // create a key, and pass it along, so that we know which state to update when it comes so
                let key = 0

                function createColumn() { // Create a new column
                    let newColumnSettings = {}
                    for (property of Object.keys(props.schema["column-schema"])) { // Set each each setting in the row to its default (or false if toggle)
                        if (property != "new" && property != "row-schema") {
                            if (props.schema["column-schema"][property]["default"]) {
                                newColumnSettings[property] = props.schema["column-schema"][property]["default"]
                            } else {
                                if (props.schema["column-schema"][property]["type"] != "toggle") {
                                    newColumnSettings[property] = null
                                } else {
                                    newColumnSettings[property] = false
                                }
                            }
                        }
                    }

                    if (props.schema["column-schema"]["row-schema"]) {
/*                        // we also need to add on a default/state member for things like "channel id"
                        console.log(props.schema["column-schema"]["row-schema"])
                        for (key of Object.keys(props.schema["column-schema"]["row-schema"])) {
                            if (key != "new") {
                                console.log(key)
                                console.log(props.schema["column-schema"]["row-schema"][key])
                                if (props.schema["column-schema"]["row-schema"][key]["default"]) {

                                } else {

                                }
                            }
                        }*/
                    } else {

                    }
                    console.log(props.schema["column-schema"])
                    newStateG[decodeURIComponent(props.url[3])][props.menu].push("a")
                    setState(JSON.parse(JSON.stringify(newStateG)))
                    console.log(newStateG[decodeURIComponent(props.url[3])][props.menu])
                    killMenu()
                }

                // add a button which creates another one of these elements, and adds the whole thing to state
                for (column of state[decodeURIComponent(props.url[3])][props.menu]) {
                    columns.push(<GenerateColumnContents key={++key} config={column} schema={props.schema["column-schema"]} />)
                }

                return (
                    <div>
                        <button type="button" onClick={createColumn} className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                            <div className="contents-18-Yxp">{translate(lang, props.schema["column-schema"].new)}</div>
                        </button>
                        {columns}
                    </div>
                )
            } else if (props.schema["row-schema"]) {
                return <div className="alert-box danger text-wrap">
                    {translate(lang, "page_columnbeforerow")}
                </div>
            } else {
                // for each column in schema, generate a column with such contents
            }

        } else {
            newStateG[decodeURIComponent(props.url[3])][props.menu] = {}
            setState(newStateG)
        }
    } else {
        newStateG[decodeURIComponent(props.url[3])] = {}
        setState(newStateG)
    }

 /*   if (props.schema["column-schema"]) {
        if (state[decodeURIComponent(props.url[3])]) {
            console.log(state[decodeURIComponent(props.url[3])])
        } else {
            newStateG[decodeURIComponent(props.url[3])] = {}
        }
    }

/*    for (col of Object.keys(props.schema)) {
        console.log(col)
    }*/

    return <div><button onClick={killMenu}>Clicky</button><button onClick={enableMenu}>Clicky</button></div>
}

module.exports = DashboardMenu