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

const { useState } = require('react')
const { Select } = require('@mui/base/Select');
const { Option } = require('@mui/base/Option');
const React = require('react')
const translate = require('./components/getLanguageString')
const Label = require('./components/label');
const getUserPermissions = require('../../core/getUserPermissions');
const getChannelType = require('./components/getChannelType')

// WHAT WE NEED TO DO:
// Implementing custom rows etc
// And of course commenting our code

function GenerateColumnContents(props) {
    let { schema, config, key2, url, channels, roles, state, setState, newStateG, lang, killMenu, rowCount } = props
    let rows = [null]
    let gridRows = 0
    let newRow

    function updateStates(newValue, category, menu, option, rowKey, checkOption) {
        killMenu()

        if (!rowKey) {
            if (checkOption) {
                newStateG[category][menu][props.column][option][checkOption] = newValue
            } else if (schema[option].type == "integer") {
                newStateG[category][menu][props.column][option] = newValue.replaceAll(".", "")
            } else {
                newStateG[category][menu][props.column][option] = newValue
            }
            setState(JSON.parse(JSON.stringify(newStateG)))
        } else {
            console.log("abcd")
        }
    }

    Object.keys(schema).map(option => {
        if (option != "new" && option != "row-schema") {
            let key = 0
            let checkSetting = []
            gridRows++
            let newOption = null
            let value

            switch (schema[option]["type"]) {
                case "shortText":
                    if (config[option] === null || config[option] === undefined) {
                        if (translate(lang, schema[option]["default"]) === null) {
                            value = ""
                        } else value = translate(lang, schema[option]["default"])
                    } else {
                        value = state[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                    }
                    newOption = <input type='text' style={{ width: 100 + "%" }} className="inputDefault-_djjkz input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option)} />
                    break;
                case "longText":
                    if (config[option] === null || config[option] === undefined) {
                        if (translate(lang, schema[option]["default"]) === null) {
                            value = ""
                        } else value = translate(lang, schema[option]["default"])
                    } else {
                        value = state[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                    }
                    newOption = <textarea rows={2} className="inputDefault-2x input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option)} />
                    break;
                case "checkbox":
                    if (!state[decodeURIComponent(props.url[3])][props.menu][props.column][option]) {
                        newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option] = {}
                    }

                    Object.keys(schema[option]["options"]).map(checkboxOption => {
                        if (newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option][checkboxOption] !== undefined && newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option][checkboxOption] !== null) {
                            value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option][checkboxOption]
                        } else if (schema[option]["options"][checkboxOption]["default"] !== undefined && schema[option]["options"][checkboxOption]["default"] !== null) {
                            value = schema[option]["options"][checkboxOption]["default"]
                        } else {
                            value = false
                        }

                        checkSetting.push(<div className="form-check form-switch" key={key++}>
                            <input className="form-check-input" type="checkbox" id={props.column + option + checkboxOption} checked={value} onChange={e => updateStates(e.target.checked, decodeURIComponent(props.url[3]), props.menu, option, undefined, checkboxOption)} />
                            <label className="form-check-label" htmlFor={props.column + option + checkboxOption}>
                                {translate(lang, schema[option]["options"][checkboxOption]["title"])}
                            </label>
                        </div>)
                    })
                    newOption = checkSetting
                    break;
                case "radio":
                    Object.keys(schema[option]["options"]).map(checkboxOption => {
                        if (newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option] == checkboxOption) {
                            value = true
                        } else if (!newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option] && checkboxOption == schema[option]["default"]) {
                            value = true
                        } else {
                            value = false
                        }

                        checkSetting.push(<div className="form-check" key={key++}>
                            <input className="form-check-input" type="radio" id={props.column + option + checkboxOption} checked={value} onChange={e => updateStates(checkboxOption, decodeURIComponent(props.url[3]), props.menu, option)} />
                            <label className="form-check-label" htmlFor={props.column + option + checkboxOption}>
                                {translate(lang, schema[option]["options"][checkboxOption]["title"])}
                            </label>
                        </div>)
                    })
                    newOption = checkSetting
                    break;
                case "integer":
                    if (config[option] === null || config[option] === undefined) {
                        if (schema[option]["default"] === null) {
                            value = ""
                        } else value = schema[option]["default"]
                    } else {
                        value = state[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                    }
                    newOption = <input type='number' style={{ width: 100 + "%" }} className="inputDefault-_djjkz input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option)} />
                    break;
                case "number":
                    if (config[option] === null || config[option] === undefined) {
                        if (schema[option]["default"] === null) {
                            value = ""
                        } else lang, schema[option]["default"]
                    } else {
                        value = state[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                    }
                    newOption = <input type='number' style={{ width: 100 + "%" }} className="inputDefault-_djjkz input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option)} />
                    break;
                case "dropdown":
                    if (config[option]) {
                        value = config[option]
                    } else if (schema[option]["default"]) {
                        value = schema[option]["default"]
                    } else {
                        value = null
                    }

                    Object.keys(schema[option]).map(opt => {
                        if (opt != "title" && opt != "type" && opt != "default") {
                            checkSetting.push(<Option key={key++} className="dropdownValue" value={opt}>{translate(lang, schema[option][opt]["title"])}</Option>)
                        }
                    })

                    newOption = <Select value={value} onChange={(_, e) => { updateStates(e, decodeURIComponent(props.url[3]), props.menu, option) }} className="customDropdown">
                        {checkSetting}
                    </Select>
                    break;
                case "role":
                    let DCRoles = JSON.parse(JSON.stringify(roles))
                    DCRoles.sort(function (a, b) { // Sort by position
                        if (a.position < b.position) { return 1; }
                        if (a.position > b.position) { return -1; }
                        return 0;
                    })
                    let roleDropdown = []
                    DCRoles.map(role => {
                        includeRole = true
                        if (schema[option]["excludeManaged"] !== false && role.managed === true) {
                            includeRole = false
                        }
                        if (schema[option]["permissionsRequired"]) {
                            schema[option]["permissionsRequired"].map(permission => {
                                if (!(getUserPermissions(role).includes(permission) || getUserPermissions(role).includes("ADMINISTRATOR"))) {
                                    includeRole = false
                                }
                            })
                        }
                        if (schema[option]["requireMentionable"] && !role.mentionable) {
                            includeRole = false
                        }
                        if (schema[option]["excludeEveryone"] && role.position === 0) {
                            includeRole = false
                        }
                        if (includeRole) {
                            roleDropdown.push(role)
                        }
                    })

                    roleDropdown.map(role => {
                        checkSetting.push(<Option key={key++} className="dropdownValue" value={role.id}><div style={{ color: "#" + role.color.toString(16) }}>{role.name}</div></Option>)
                    })

                    if (config[option]) {
                        value = config[option]
                    } else {
                        value = null
                    }

                    newOption = <Select value={value} onChange={(_, e) => { updateStates(e, decodeURIComponent(props.url[3]), props.menu, option) }} className="customDropdown">
                        {checkSetting}
                    </Select>
                    break;
                case "channel":
                    let DCChannels = JSON.parse(JSON.stringify(channels))
                    let organisedChannelList = {}
                    let sortedCategoryList
                    DCChannels.map(channel => {
                        if (!schema[option]["filter"]) {
                            if (getChannelType(channel.type) != "GUILD_CATEGORY") {
                                if ((channel.parent_id !== null && !organisedChannelList[channel.parent_id]) || (channel.parent_id === null && !organisedChannelList["orphan"])) {
                                    if (channel.parent_id == null) {
                                        organisedChannelList["orphan"] = [{ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) }]
                                    } else {
                                        organisedChannelList[channel.parent_id] = [{ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) }]
                                    }
                                } else {
                                    if (channel.parent_id == null) {
                                        organisedChannelList["orphan"].push({ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) })
                                    } else {
                                        organisedChannelList[channel.parent_id].push({ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) })
                                    }
                                }
                            }
                        } else if (schema[option]["filter"] == "GUILD_CATEGORY" && !schema[option]["filter"][1] && getChannelType(channel.type) == "GUILD_CATEGORY") {
                            organisedChannelList[channel.id] = { name: channel.name, position: channel.position }
                        } else {
                            let includeInFilter = false
                            schema[option]["filter"].map(type => {
                                if (type == getChannelType(channel.type) && type != "GUILD_CATEGORY") {
                                    includeInFilter = true
                                }
                            })

                            if (includeInFilter) {
                                if ((channel.parent_id !== null && !organisedChannelList[channel.parent_id]) || (channel.parent_id === null && !organisedChannelList["orphan"])) {
                                    if (channel.parent_id == null) {
                                        organisedChannelList["orphan"] = [{ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) }]
                                    } else {
                                        organisedChannelList[channel.parent_id] = [{ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) }]
                                    }
                                } else {
                                    if (channel.parent_id == null) {
                                        organisedChannelList["orphan"].push({ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) })
                                    } else {
                                        organisedChannelList[channel.parent_id].push({ id: channel.id, name: channel.name, position: channel.position, type: getChannelType(channel.type) })
                                    }
                                }
                            }
                        }
                    })

                    let sortedChannels = {}
                    if (schema[option]["filter"] == "GUILD_CATEGORY" && !schema[option]["filter"][1]) {
                        sortedCategoryList = Object.entries(organisedChannelList).sort(function (a, b) { // Sort by position
                            if (a[1].position > b[1].position) { return 1; }
                            if (a[1].position < b[1].position) { return -1; }
                            return 0;
                        })
                    } else {
                        Object.keys(organisedChannelList).map(category => {
                            sortedChannels[category] = organisedChannelList[category].sort(function (a, b) { // Sort by position
                                if (a.position > b.position) { return 1; }
                                if (a.position < b.position) { return -1; }
                                return 0;
                            })
                        })

                        sortedCategoryList = Object.entries(sortedChannels).sort(function (a, b) { // Sort by position
                            if (a[0] == "orphan") { return -1 }
                            if (b[0] == "orphan") { return 1 }
                            if (DCChannels.find(element => element.id == a[0]).position > DCChannels.find(element => element.id == b[0]).position) { return 1; }
                            if (DCChannels.find(element => element.id == a[0]).position < DCChannels.find(element => element.id == b[0]).position) { return -1; }
                            return 0;
                        })
                    }

                    if (config[option]) {
                        value = config[option]
                    } else {
                        value = null
                    }

                    sortedCategoryList.map(item => {
                        if (schema[option]["filter"] == "GUILD_CATEGORY" && !schema[option]["filter"][1]) {
                            checkSetting.push(<Option key={key++} className="channelCategory dropdownValue" value={item[0]}><div style={{ marginLeft: 26 + "px" }}>{item[1].name}</div></Option>)
                        } else {
                            if (item[0] != "orphan") {
                                checkSetting.push(<Option key={key++} className="channelCategory channelCategoryListChannels dropdownValue" value={item[0]}><div style={{ marginLeft: 26 + "px" }}>{DCChannels.find(element => element.id == item[0]).name}</div></Option>)
                            }
                            item[1].map(channel => {
                                let cssClass
                                switch (channel.type) {
                                    case "GUILD_TEXT":
                                        cssClass = "textChannel"
                                        break;
                                    case "GUILD_VOICE":
                                        cssClass = "voiceChannel"
                                        break;
                                    case "GUILD_ANNOUNCEMENT":
                                        cssClass = "announcementChannel"
                                        break;
                                    case "GUILD_STAGE_VOICE":
                                        cssClass = "stageChannel"
                                        break;
                                    case "GUILD_FORUM":
                                        cssClass = "forumChannel"
                                        break;
                                    case "GUILD_MEDIA":
                                        cssClass = "mediaChannel"
                                        break;
                                    default:
                                        cssClass = "unknownChannel"
                                        break;
                                }
                                checkSetting.push(<Option key={key++} className={"dropdownValue " + cssClass} value={channel.id}><div style={{ marginLeft: 26 + "px" }}>{channel.name}</div></Option>)
                            })
                        }
                    })

                    newOption = <Select value={value} onChange={(_, e) => { updateStates(e, decodeURIComponent(props.url[3]), props.menu, option) }} className="customDropdown">
                        {checkSetting}
                    </Select>
            }
            let entry = <div key={option}>
                <Label for={option} required={schema[option]["required"]}>{translate(lang, schema[option]["title"])}</Label>
                {newOption}
            </div>
            rows.push(entry)
        }
    })

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
        // also we need to increase gridRows every for every new row
        rows[0] = (<button type="button" key={"#newRow"} onClick={createRow} style={{ marginTop: 5 + "px" }} className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
            <div className="contents-18-Yxp">{translate(lang, schema["row-schema"].new)}</div>
        </button>)

    }

    const mediaQuery = window.matchMedia("(max-width: 600px)") // This is *extremely* janky but it means that the height of the columns differs depending on whether a user is using mobile or desktop
    let gridHeight

    if (mediaQuery.matches) {
        gridHeight = gridRows
    } else {
        gridHeight = rowCount
    }

    console.log(rowCount)

    return <div className={"cat-link column-card"} style={{
        gridRow: "auto/span " + gridHeight
    }}>
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

    function determineRowCount(schema, config) { // We need to get the maximum number of rows for the menu selected
        let rowCount = 0
        let maxCount = 0

        if (!schema["column-schema"] || !schema["column-schema"]["row-schema"]) { // If we have no column schema, that's simple
            Object.keys(schema).map(col => { // For each column, see if its number of inputs is longer than the current row count
                if (col != "title") {
                    if (Object.keys(schema[col]).length > rowCount && schema["column-schema"]) {
                        rowCount = Object.keys(schema[col]).length - 1 // If the above is correct, set that to the new row count, subtract 1 for "new"
                    } else if (Object.keys(schema[col]).length > rowCount) { // We do not subtract 1 since we don't have a column-schema in this case
                        rowCount = Object.keys(schema[col]).length // If the above is correct, set that to the new row count
                    }
                }
            })
        } else {
            if (schema["column-schema"]["row-schema"]) { // If there's row schema:
                config.map(column => { // Get each column
                    if ((column.rows.length * (Object.keys(schema["column-schema"]["row-schema"]).length - 1)) > maxCount) { // If the number of rows multiplied by the length of the row schema (subtract one for "new") is greater than maxCount
                        maxCount = column.rows.length * (Object.keys(schema["column-schema"]["row-schema"]).length - 1) // Set the maxCount to it
                    }
                })

                rowCount += maxCount + 1 // Add 1 for the button
            }
        }

        return rowCount
    }

    let config = props.settings.config

    let [state, setState] = useState(JSON.parse(JSON.stringify(config))) // Doing it this way means that we don't have problems with pointers!!!
    let newStateG = JSON.parse(JSON.stringify(state))

    if (state[decodeURIComponent(props.url[3])]) {
        let columns = []
        let key = 0
        if (state[decodeURIComponent(props.url[3])][props.menu]) {
            console.log(state[decodeURIComponent(props.url[3])][props.menu])
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

                for (columnIndex in state[decodeURIComponent(props.url[3])][props.menu]) { // Add another column for each entry within the database
                    let column = state[decodeURIComponent(props.url[3])][props.menu][columnIndex]
                    console.log(state[decodeURIComponent(props.url[3])][props.menu])
                    console.log(columnIndex)
                    columns.push(<GenerateColumnContents key={key} roles={props.settings.roles} channels={props.settings.channels} config={column} column={columnIndex} rowCount={determineRowCount(props.schema, state[decodeURIComponent(props.url[3])][props.menu])} schema={props.schema["column-schema"]} key2={key++} url={props.url} menu={props.menu} state={state} setState={setState} newStateG={newStateG} lang={lang} killMenu={killMenu} />)
                }

                return (
                    <div>
                        <button type="button" onClick={createColumn} className="margin8 button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                            <div className="contents-18-Yxp">{translate(lang, props.schema["column-schema"].new)}</div>
                        </button>
                        <div className="config-grid" style={{ gridRowGap: 0 }}>
                            {columns}
                        </div>
                    </div>
                )
            } else if (props.schema["row-schema"]) {
                return <div className="alert-box danger text-wrap">
                    {translate(lang, "page_columnbeforerow")}
                </div>
            } else {
                Object.keys(props.schema).map(column => { // Add another column for each entry within the database
                    if (column != "title") {
                        let passedConfig
                        if (!state[decodeURIComponent(props.url[3])][props.menu][column]) {
                            newStateG[decodeURIComponent(props.url[3])][props.menu][column] = {}
                            setState(JSON.parse(JSON.stringify(newStateG)))
                        }
                        passedConfig = state[decodeURIComponent(props.url[3])][props.menu][column]
                        columns.push(<GenerateColumnContents key={key++} roles={props.settings.roles} channels={props.settings.channels} config={passedConfig} rowCount={determineRowCount(props.schema)} schema={props.schema[column]} url={props.url} menu={props.menu} column={column} state={state} setState={setState} newStateG={newStateG} lang={lang} killMenu={killMenu} />)
                    }
                })
                return <div className="config-grid" style={{ gridRowGap: 0 }}>
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