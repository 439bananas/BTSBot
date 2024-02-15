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
const Label = require('./components/label')

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

    let config = props.settings.config

    let [state, setState] = useState(JSON.parse(JSON.stringify(config))) // Doing it this way means that we don't have problems with pointers!!!
    let newStateG = JSON.parse(JSON.stringify(state))

    function GenerateColumnContents(props) {
        let { schema, config, key2 } = props
        let GCCKey = 0
        let rows = [null]
        let newRow

        console.log(props)
        console.log(state)
        console.log(key2)
        console.log(schema)

        function updateStates(newValue, stateToSet, columnMode, columnKey, rowMode, rowKey) {

        }

        for (option of Object.keys(schema)) {
            if (option != "new" && option != "row-schema") {
                console.log(option)
                console.log(schema[option])
                let newOption
                switch (schema[option]["type"]) {

                }
                let entry = <div key={++GCCKey}>
                    <Label for={option} required={schema[option]["required"]}>{translate(lang, schema[option]["title"])}</Label>
                </div>
                rows.push(entry)
            }
        }

        // create config entries here, if row schema, then append more

        if (schema["row-schema"]) {
            function createRow() {
                // break apart schema
                // similar to createColumn? not sure
                // push it along
                // oh yeah and also update state
            }

            console.log("yeet")
            console.log(schema)
            // WE NEED TO CREATE ROW
            rows[0] = (<button type="button" key={0} onClick={createRow} style={{marginTop: 5 + "px"}} className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                <div className="contents-18-Yxp">{translate(lang, schema["row-schema"].new)}</div>
            </button>)

        } else {
            console.log("dab")
        }

        return <div className={"cat-link column-card"}>
            {rows}
        </div>

        // remember that column-schema exists, we might have to deal with that too...
        // remember that we also have to deal with row-schema
        // we also need to update state whenever a change is made
        // hold on we also need to amend css? what the-
        // defaults also need to be countered in here...
        return <div className={"cat-link column-card"}>
            c
        </div>
    }

    if (state[decodeURIComponent(props.url[3])]) {
        let columns = []
        let key = 0
        if (state[decodeURIComponent(props.url[3])][props.menu]) {
            if (props.schema["column-schema"]) {
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

                for (column of state[decodeURIComponent(props.url[3])][props.menu]) { // Add another column for each entry within the database
                    columns.push(<GenerateColumnContents key={key} config={column} schema={props.schema["column-schema"]} key2={key++} />)
                }

                return (
                    <div>
                        <button type="button" onClick={createColumn} className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                            <div className="contents-18-Yxp">{translate(lang, props.schema["column-schema"].new)}</div>
                        </button>
                        <div className="grid">
                            {columns}
                        </div>
                    </div>
                )
            } else if (props.schema["row-schema"]) {
                return <div className="alert-box danger text-wrap">
                    {translate(lang, "page_columnbeforerow")}
                </div>
            } else {
                for (column of Object.keys(props.schema)) { // Add another column for each entry within the database
                    if (column != "title") {
                        columns.push(<GenerateColumnContents key={key++} config={state[decodeURIComponent(props.url[3])][props.menu]} schema={props.schema[column]} />)
                    }
                }
                return <div className="grid" style={{gridRowGap: 0}}>
                    {columns}
                </div>
            }

        } else {
            if (props.schema["column-schema"]) { // Either add an array or an object depending on whether there's schema or just entries in the YAML
                newStateG[decodeURIComponent(props.url[3])][props.menu] = []
            } else {
                newStateG[decodeURIComponent(props.url[3])][props.menu] = {}
            }
            setState(newStateG)
        }
    } else {
        newStateG[decodeURIComponent(props.url[3])] = {}
        setState(newStateG)
    }
}

module.exports = DashboardMenu