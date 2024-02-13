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

function DashboardMenu(props) {
    let { lang } = props

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
        // remember that we also have to deal with row-schema
        // we also need to update state whenever a change is made
        // defaults also need to be countered in here...
        return "c"
    }

    if (state[decodeURIComponent(props.url[3])]) {
        if (state[decodeURIComponent(props.url[3])][props.menu]) {
            console.log(state[decodeURIComponent(props.url[3])][props.menu])
            if (props.schema["column-schema"]) {
                let key = 0
                let columns = []

                function createColumn() { // Create a new column
                    let newColumnSettings = {}
                    for (property of Object.keys(props.schema["column-schema"])) { // Set each each setting in the row to null
                        if (property != "new" && property != "row-schema") {
                            newColumnSettings[property] = null
                        }
                    }

                    if (props.schema["column-schema"]["row-schema"]) {
                        let rows = []
                        let initialRow = {}

                        for (property of Object.keys(props.schema["column-schema"]["row-schema"])) { // For each property, set it as null (which would show default)
                            if (property != "new") {
                                initialRow[property] = null
                            }
                        }

                        rows.push(initialRow) // Push this initial row to the list of rows
                        newColumnSettings["rows"] = rows // Add this array to the rows key within the object
                    }

                    newStateG[decodeURIComponent(props.url[3])][props.menu].push(newColumnSettings) // Adding the new column settings and then setting state will force a rerender
                    setState(JSON.parse(JSON.stringify(newStateG)))
                    killMenu()
                }

                for (column of state[decodeURIComponent(props.url[3])][props.menu]) { // Add another column for each entry within te database
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