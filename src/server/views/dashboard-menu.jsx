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

function CreateNewRow(props) { // Display a different option deending on the type
    const { updateStates, config, schema, rowIndex, newStateG, state, roles, channels, lang, option } = props
    let key = 0
    let checkSetting = []
    let value
    let newOption

    switch (schema[option]["type"]) { // Switch between the type of the option
        case "shortText":
            if (config[option] === null || config[option] === undefined) { // If this is not in the guild config:
                if (translate(lang, schema[option]["default"]) === null) { // If the default value is null, the value is blank
                    value = ""
                } else value = translate(lang, schema[option]["default"]) // Else, use the default
            } else {
                if (!rowIndex) { // Then set to the option within the row (or column), depending on whether there's rowIndex
                    value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                } else {
                    value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option]
                }
            }
            newOption = <input type='text' style={{ width: 100 + "%" }} className="inputDefault-_djjkz input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option, rowIndex)} />
            break;
        case "longText": // All the same as above
            if (config[option] === null || config[option] === undefined) {
                if (translate(lang, schema[option]["default"]) === null) {
                    value = ""
                } else value = translate(lang, schema[option]["default"])
            } else {
                if (!rowIndex) {
                    value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                } else {
                    value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option]
                }
            }
            newOption = <textarea rows={2} className="inputDefault-2x input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option, rowIndex)} />
            break;
        case "checkbox": // And by checkbox, I mean a slider toggle
            if (!rowIndex) {
                if (!newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option]) { // If this is not in config, create an object in newStateG (not yet committed) and make it blank
                    newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option] = {}
                }
            } else {
                if (!newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option]) {
                    newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option] = {}
                }
            }

            Object.keys(schema[option]["options"]).map(checkboxOption => { // Set our value depending on what state/defaults say
                if (!rowIndex && (newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option][checkboxOption] !== undefined && newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option][checkboxOption] !== null)) {
                    value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option][checkboxOption]
                } else if (rowIndex && (newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option][checkboxOption] !== undefined && newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option][checkboxOption] !== null)) {
                    value = newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option][checkboxOption]
                } else if (schema[option]["options"][checkboxOption]["default"] !== undefined && schema[option]["options"][checkboxOption]["default"] !== null) {
                    value = schema[option]["options"][checkboxOption]["default"]
                } else {
                    value = false
                }

                checkSetting.push(<div className="form-check form-switch" key={key++}>
                    <input className="form-check-input" type="checkbox" id={props.column + option + rowIndex + checkboxOption} checked={value} onChange={e => updateStates(e.target.checked, decodeURIComponent(props.url[3]), props.menu, option, rowIndex, checkboxOption)} />
                    <label className="form-check-label" htmlFor={props.column + option + rowIndex + checkboxOption}>
                        {translate(lang, schema[option]["options"][checkboxOption]["title"])}
                    </label>
                </div>) // Push the setting along
            })
            newOption = checkSetting
            break;
        case "radio": // Pretty similar to above ngl
            Object.keys(schema[option]["options"]).map(checkboxOption => {
                if (!rowIndex && newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option] == checkboxOption) {
                    value = true
                } else if (!rowIndex && (!newStateG[decodeURIComponent(props.url[3])][props.menu][props.column][option] && checkboxOption == schema[option]["default"])) {
                    value = true
                } else if (rowIndex && newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option] == checkboxOption) {
                    value = true
                } else if (rowIndex && (!newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option] && checkboxOption == schema[option]["default"])) {
                    value = true
                } else {
                    value = false
                }

                checkSetting.push(<div className="form-check" key={key++}>
                    <input className="form-check-input" type="radio" id={props.column + option + checkboxOption} checked={value} onChange={e => updateStates(checkboxOption, decodeURIComponent(props.url[3]), props.menu, option, rowIndex)} />
                    <label className="form-check-label" htmlFor={props.column + option + checkboxOption}>
                        {translate(lang, schema[option]["options"][checkboxOption]["title"])}
                    </label>
                </div>)
            })
            newOption = checkSetting
            break;
        case "integer": // Similar to shortText
            if (config[option] === null || config[option] === undefined) {
                if (schema[option]["default"] === null) {
                    value = ""
                } else value = schema[option]["default"]
            } else {
                if (rowIndex) {
                    value = state[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option]
                } else {
                    value = state[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                }
            }
            newOption = <input type='number' style={{ width: 100 + "%" }} className="inputDefault-_djjkz input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option, rowIndex)} />
            break;
        case "number": // Similar to shortText
            if (config[option] === null || config[option] === undefined) {
                if (schema[option]["default"] === null) {
                    value = ""
                } else value = schema[option]["default"]
            } else {
                if (rowIndex) {
                    value = state[decodeURIComponent(props.url[3])][props.menu][props.column].rows[rowIndex][option]
                } else {
                    value = state[decodeURIComponent(props.url[3])][props.menu][props.column][option]
                }
            }
            newOption = <input type='number' style={{ width: 100 + "%" }} className="inputDefault-_djjkz input-cIJ7To2 size16-1__VVI" name={option} value={value} onChange={e => updateStates(e.target.value, decodeURIComponent(props.url[3]), props.menu, option, rowIndex)} />
            break;
        case "dropdown": // Dropdowns!!!
            if (config[option]) { // Thankfully MUI saved my backside so all I have to do is set a defined value
                value = config[option]
            } else if (schema[option]["default"]) {
                value = schema[option]["default"]
            } else {
                value = null
            }

            Object.keys(schema[option]).map(opt => { // For each in schema, add the option as per YAML
                if (opt != "title" && opt != "type" && opt != "default") {
                    checkSetting.push(<Option key={key++} className="dropdownValue" value={opt}>{translate(lang, schema[option][opt]["title"])}</Option>)
                }
            })

            // Return the select
            newOption = <Select value={value} onChange={(_, e) => { updateStates(e, decodeURIComponent(props.url[3]), props.menu, option, rowIndex) }} className="customDropdown">
                {checkSetting}
            </Select>
            break;
        case "role":
            let DCRoles = JSON.parse(JSON.stringify(roles)) // Deep copy roles so that we don't have any funky problems
            DCRoles.sort(function (a, b) { // Sort by position of roles
                if (a.position < b.position) { return 1; }
                if (a.position > b.position) { return -1; }
                return 0;
            })
            let roleDropdown = []
            DCRoles.map(role => {
                includeRole = true
                if (schema[option]["excludeManaged"] !== false && role.managed === true) { // Enforce constraints
                    includeRole = false
                }

                if (schema[option]["permissionsRequired"]) {
                    schema[option]["permissionsRequired"].map(permission => {
                        if (!(getUserPermissions(role).includes(permission) || getUserPermissions(role).includes("ADMINISTRATOR"))) { // Get the permissions of the role and see if they include administrator or any of mentioned permissions
                            includeRole = false // If not, do not include the role
                        }
                    })
                }

                if (schema[option]["requireMentionable"] && !role.mentionable) { // Enforce role being mentionable by everyone if so configured in YAML
                    includeRole = false
                }

                if (schema[option]["excludeEveryone"] && role.position === 0) { // Role position for @everyone is always 0
                    includeRole = false
                }

                if (includeRole) { // If we survive the purge, push the role onto the array
                    roleDropdown.push(role)
                }
            })

            roleDropdown.map(role => { // For each item in above array, create a new gropdown option
                checkSetting.push(<Option key={key++} className="dropdownValue" value={role.id}><div style={{ color: "#" + role.color.toString(16) }}>{role.name}</div></Option>)
            })

            if (config[option]) { // Basically like above
                value = config[option]
            } else {
                value = null
            }

            newOption = <Select value={value} onChange={(_, e) => { updateStates(e, decodeURIComponent(props.url[3]), props.menu, option, rowIndex) }} className="customDropdown">
                {checkSetting}
            </Select>
            break;
        case "channel": // Man am I gonna scream again
            let DCChannels = JSON.parse(JSON.stringify(channels)) // Deep copy the channel list
            let organisedChannelList = {}
            let sortedCategoryList
            DCChannels.map(channel => { // For each in the list:
                if (!schema[option]["filter"]) { // If there's no filter, show all channels
                    if (getChannelType(channel.type) != "GUILD_CATEGORY") { // No we should not sort guild categories yet
                        if ((channel.parent_id !== null && !organisedChannelList[channel.parent_id]) || (channel.parent_id === null && !organisedChannelList["orphan"])) {
                            if (channel.parent_id == null) { // This small block until the next comment is responsible for putting channels into their own categories' objects
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
                } else if (schema[option]["filter"] == "GUILD_CATEGORY" && !schema[option]["filter"][1] && getChannelType(channel.type) == "GUILD_CATEGORY") { // Only show guild categories if so configured
                    organisedChannelList[channel.id] = { name: channel.name, position: channel.position }
                } else { // If we have a filter...
                    let includeInFilter = false
                    schema[option]["filter"].map(type => {
                        if (type == getChannelType(channel.type) && type != "GUILD_CATEGORY") { // If the type matches as above and the type is not guild category, include in list
                            includeInFilter = true
                        }
                    })

                    if (includeInFilter) { // If includes, then let's put into the organised channel list
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
                sortedCategoryList = Object.entries(organisedChannelList).sort(function (a, b) { // Sort categories by position
                    if (a[1].position > b[1].position) { return 1; }
                    if (a[1].position < b[1].position) { return -1; }
                    return 0;
                })
            } else {
                Object.keys(organisedChannelList).map(category => {
                    sortedChannels[category] = organisedChannelList[category].sort(function (a, b) { // Sort each channel in each category by position
                        if (a.position > b.position) { return 1; }
                        if (a.position < b.position) { return -1; }
                        return 0;
                    })
                })

                sortedCategoryList = Object.entries(sortedChannels).sort(function (a, b) { // Sort each category (which includes each channel in order) by position now
                    if (a[0] == "orphan") { return -1 }
                    if (b[0] == "orphan") { return 1 }
                    if (DCChannels.find(element => element.id == a[0]).position > DCChannels.find(element => element.id == b[0]).position) { return 1; }
                    if (DCChannels.find(element => element.id == a[0]).position < DCChannels.find(element => element.id == b[0]).position) { return -1; }
                    return 0;
                })
            }

            if (config[option]) { // Set the value
                value = config[option]
            } else {
                value = null
            }

            sortedCategoryList.map(item => { // Begin pushing categories and channels
                if (schema[option]["filter"] == "GUILD_CATEGORY" && !schema[option]["filter"][1]) {
                    checkSetting.push(<Option key={key++} className="channelCategory dropdownValue" value={item[0]}><div style={{ marginLeft: 26 + "px" }}>{item[1].name}</div></Option>)
                } else {
                    if (item[0] != "orphan") {
                        checkSetting.push(<Option key={key++} className="channelCategory channelCategoryListChannels dropdownValue" value={item[0]}><div style={{ marginLeft: 26 + "px" }}>{DCChannels.find(element => element.id == item[0]).name}</div></Option>)
                    }
                    item[1].map(channel => { // Select the CSS class depending on the channel type - this determines what icon to show
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

            // And now we return the dropdown!
            newOption = <Select value={value} onChange={(_, e) => { updateStates(e, decodeURIComponent(props.url[3]), props.menu, option, rowIndex) }} className="customDropdown">
                {checkSetting}
            </Select>
    }

    return newOption
}

function DeleteButtonRow(props) { // Component that shows the "delete" button for rows
    const { rowIndex, lang, deleteRow, rowSchema } = props
    return (
        <div className="deleteButtonWrapper">
            <button type="button" data-bs-toggle="modal" data-bs-target={"#ModalDeleteColumn" + props.column + "Row" + rowIndex} className="deleteButton button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY grow-q77ONN">
                <div className="contents-18-Yxp deleteIconRow"></div>
            </button>
            <div className="modal fade" id={"ModalDeleteColumn" + props.column + "Row" + rowIndex} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{translate(lang, rowSchema.deleteRowHeader)}</h3>
                        </div>
                        <div className="modal-body">
                            <p>{translate(lang, rowSchema.deleteRowBody)}</p>
                        </div>
                        <div className="modal-footer">
                            <a href="#" data-bs-dismiss="modal" aria-label="Close">{translate(lang, "page_dashboarddeletecolorrowmodalcancel")}</a>
                            <button type="button" data-bs-dismiss="modal" onClick={() => deleteRow(props.column, rowIndex)} className="dangerButton button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeLarge grow-q77ONN">
                                <div className="contents_fb6220">{translate(lang, "page_dashboarddeletecolorrowmodaldelete")}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DeleteButtonColumn(props) { // Component that shows the "delete" button for components
    const { lang, deleteColumn, schema } = props
    return (
        <div className="deleteButtonWrapper">
            <button type="button" style={{ marginTop: 5 + "px" }} data-bs-toggle="modal" data-bs-target={"#ModalDeleteColumn" + props.column} className="deleteButton button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY grow-q77ONN">
                <div className="contents-18-Yxp deleteIcon"></div>
            </button>
            <div className="modal fade" id={"ModalDeleteColumn" + props.column} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{translate(lang, schema.deleteColumnHeader)}</h3>
                        </div>
                        <div className="modal-body">
                            <p>{translate(lang, schema.deleteColumnBody)}</p>
                        </div>
                        <div className="modal-footer">
                            <a href="#" data-bs-dismiss="modal" aria-label="Close">{translate(lang, "page_dashboarddeletecolorrowmodalcancel")}</a>
                            <button type="button" data-bs-dismiss="modal" onClick={() => deleteColumn(props.column)} className="dangerButton button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeLarge grow-q77ONN">
                                <div className="contents_fb6220">{translate(lang, "page_dashboarddeletecolorrowmodaldelete")}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function GenerateColumnContents(props) { // Generate the contents for each column
    let { schema, config, key2, url, channels, roles, state, setState, newStateG, lang, killMenu, rowCount } = props
    let rows = [null]
    let gridRows = 0

    function updateStates(newValue, category, menu, option, rowKey, checkOption) {
        killMenu() // Immediately, kill menu options so that user cannot accidentally navigate away

        if (!rowKey) { // Depending on whether there's row-schema, decide what we want to set in state
            if (checkOption) {
                newStateG[category][menu][props.column][option][checkOption] = newValue
            } else if (schema[option].type == "integer") {
                newStateG[category][menu][props.column][option] = newValue.replaceAll(".", "") // If the type of what we're setting is an integer, remove all full stops
            } else {
                newStateG[category][menu][props.column][option] = newValue
            }
            setState(JSON.parse(JSON.stringify(newStateG))) // Deep copy time!!
        } else {
            if (checkOption) {
                newStateG[category][menu][props.column].rows[rowKey][option][checkOption] = newValue
            } else if (schema["row-schema"][option].type == "integer") {
                newStateG[category][menu][props.column].rows[rowKey][option] = newValue.replaceAll(".", "")
            } else {
                newStateG[category][menu][props.column].rows[rowKey][option] = newValue
            }
            setState(JSON.parse(JSON.stringify(newStateG)))
        }
    }

    function deleteRow(column, row) { // Functions to delete rows and columns
        newStateG[decodeURIComponent(props.url[3])][props.menu][column].rows.splice(row, 1)
        setState(JSON.parse(JSON.stringify(newStateG)))
        killMenu()
    }

    function deleteColumn(column) {
        newStateG[decodeURIComponent(props.url[3])][props.menu].splice(column, 1)
        setState(JSON.parse(JSON.stringify(newStateG)))
        killMenu()
    }

    Object.keys(schema).map(option => { // For each option, create new row element
        if (option != "new" && option != "row-schema" && option != "deleteColumnHeader" && option != "deleteColumnBody") {
            gridRows++
            let newOption = <CreateNewRow updateStates={updateStates} config={config} schema={schema} menu={props.menu} url={props.url} column={props.column} newStateG={newStateG} state={state} roles={roles} channels={channels} lang={lang} option={option} />

            let entry = <div key={option} className="marginBottom20">
                <Label for={option} required={schema[option]["required"]}>{translate(lang, schema[option]["title"])}</Label>
                {newOption}
            </div>
            rows.push(entry)
        }
    })

    if (schema["row-schema"]) { // And if we have row schema:
        gridRows++
        function createRow() {
            let newRowSettings = {}
            for (property of Object.keys(props.schema["row-schema"])) { // Set each each setting in the new row to default or null
                if (property != "new" && property != "row-schema") {
                    if (props.schema["row-schema"][property].default) {
                        newRowSettings[property] = translate(lang, props.schema["row-schema"][property].default)
                    } else {
                        newRowSettings[property] = null
                    }
                }
            }

            newStateG[decodeURIComponent(props.url[3])][props.menu][props.column].rows.push(newRowSettings)
            setState(JSON.parse(JSON.stringify(newStateG)))
            killMenu()
        }

        const rowSchema = schema["row-schema"]
        let key = 0

        Object.keys(config.rows).map(rowIndex => { // For each row (yes this is janky but it's the only way I could see):
            let row = config.rows[rowIndex]
            let newRowBeginning = true
            Object.keys(rowSchema).map(option => { // For each member of row-schema:
                if (option != "new" && option != "deleteRowHeader" && option != "deleteRowBody") { // Create a new row!!
                    gridRows++ // This exists for mobile users
                    let newOption = <CreateNewRow rowIndex={rowIndex} updateStates={updateStates} config={row} schema={rowSchema} menu={props.menu} url={props.url} column={props.column} newStateG={newStateG} state={state} roles={roles} channels={channels} lang={lang} option={option} />

                    let deleteButton = null
                    if (newRowBeginning) { // Add a delete button
                        deleteButton = <DeleteButtonRow column={props.column} rowIndex={rowIndex} rowSchema={rowSchema} lang={lang} deleteRow={deleteRow} />
                    } else { // Even out spacing
                        deleteButton = <div style={{ height: 20 + "px", width: 1 + "px" }}></div>
                    }

                    let entry = <div key={key++} className="marginBottom20">
                        <Label for={option} required={rowSchema[option]["required"]}>
                            {translate(lang, rowSchema[option]["title"])}
                            {deleteButton}
                        </Label>
                        {newOption}
                    </div>
                    rows.push(entry)
                    newRowBeginning = false
                }
            })
        })

        rows[0] = (<div key={"#newRow"} className="marginBottom20 columnOptions">
            <button type="button" onClick={createRow} style={{ marginTop: 5 + "px" }} className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                <div className="contents-18-Yxp">{translate(lang, schema["row-schema"].new)}</div>
            </button>
            <DeleteButtonColumn column={props.column} lang={lang} deleteColumn={deleteColumn} schema={schema} />
        </div>)
    } else if (schema["deleteColumnHeader"]) {
        gridRows++
        rows[0] = <div key={"#newRow"} className="marginBottom20 columnOptions">
            <DeleteButtonColumn column={props.column} lang={lang} deleteColumn={deleteColumn} schema={schema} />
        </div>
    }

    const mediaQuery = window.matchMedia("(max-width: 600px)") // This is *extremely* janky but it means that the height of the columns differs depending on whether a user is using mobile or desktop
    let gridHeight

    if (mediaQuery.matches) {
        gridHeight = gridRows
    } else {
        gridHeight = rowCount
    }

    return <div className={"cat-link column-card"} style={{
        gridRow: "auto/span " + gridHeight
    }}>
        {rows}
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
                    if (((column.rows.length) * (Object.keys(schema["column-schema"]["row-schema"]).length - 3)) > maxCount) { // If the number of rows multiplied by the length of the row schema is greater than maxCount
                        maxCount = (column.rows.length) * (Object.keys(schema["column-schema"]["row-schema"]).length - 3) // Set the maxCount to it
                    }
                })

                rowCount += maxCount + Object.keys(schema["column-schema"]).length - 1 // Add 1 for the button, but subtract two for "new" and "row-schema" within column-schema
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
            if (props.schema["column-schema"]) {
                function createColumn() { // Create a new column
                    let newColumnSettings = {}
                    for (property of Object.keys(props.schema["column-schema"])) { // Set each each setting in the row to null
                        if (property != "new" && property != "row-schema" && property != "deleteColumnBody" && property != "deleteColumnHeader") {
                            newColumnSettings[property] = null
                        }
                    }

                    if (props.schema["column-schema"]["row-schema"]) {
                        let rows = []
                        let initialRow = {}

                        for (property of Object.keys(props.schema["column-schema"]["row-schema"])) { // For each property, set it as null (which would show default)
                            if (property != "new" && property != "deleteRowHeader" && property != "deleteRowBody") {
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
                    columns.push(<GenerateColumnContents key={key} roles={props.settings.roles} channels={props.settings.channels} config={column} column={columnIndex} rowCount={determineRowCount(props.schema, state[decodeURIComponent(props.url[3])][props.menu])} schema={props.schema["column-schema"]} key2={key++} url={props.url} menu={props.menu} state={state} setState={setState} newStateG={newStateG} lang={lang} killMenu={killMenu} />)
                }

                return (
                    <div className="marginBottom20">
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