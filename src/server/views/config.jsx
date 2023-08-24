/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: config.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { useState, useEffect } = require('react');
const React = require('react')
const translate = require('./components/getLanguageString');
const ConfigComplete = require('./config-complete');
const ErrorPage = require('./error-page-spa');
const CreateConfigPassword = require('./create-configuration-password');
const RequestConfigPassword = require('./enter-configuration-password');
const ConfigForm = require('./config-form');
// small problem for config
// how on earth are we supposed to deal with oauth2 at this point??
// call an api which checks if oauth2 validation is required
// if response is "OAUTH_OK" then show the user the "config complete" page. THE API ENDPOINT SHOULD AUTOMATICALLY RESTART THE APPLICATION
// if it's "OAUTH_REDIRECT" then redirect to the specified url
// if it's "OAUTH_FAIL" then show a failure
// if "TOKEN_FAIL" then show that error
// if "NO_CONF" then just show the page without any failures
// if "CONF_OK" then display a 404
// if "REFRESH_PAGE", redirect to /config without the code
// if "BAD_CLIENT_SECRET", show the same page but show the bad client secret error
// if "CANNOT_CONNECT_TO_MICROSOFT", show the wall and show that error
// if "CANNOT_CONNECT_TO_DISCORD", ditto as for microsoft (but show the discord error)
// if "CANNOT_CONNECT_TO_GOOGLE", once again, the same thing again for google
// else, show the wall and the error
// if the conf does exist, get the config from the api and set these options as default
// the api will need to be modified to get the entire config, excluding any and all passwords or tokens

function getOauthStatus(query) { // See if OAuth is ok, and if not, return any errors
    const [oauthStatus, setOauthStatus] = useState([])
    const queryString = new URLSearchParams(query).toString()

    useEffect(() => {
        async function fetchOauthStatus() {
            let rawResponse = await fetch("/api/oauth2-status?" + queryString)
            let response = await rawResponse.json()
            setOauthStatus(response)
        }

        fetchOauthStatus()
    }, [])

    return oauthStatus
}

function getConfSettings() { // Putting this hook here rather than in the same place as the form (and passing it in as a prop) reduces the unnecessary API calls
    const [confSettings, setConfSettings] = useState({})

    useEffect(() => {
        async function fetchConfSettings() {
            let rawResponse = await fetch("/api/conf-values")
            let response = await rawResponse.json()
            setConfSettings(response)
        }

        fetchConfSettings()
    }, [])

    return confSettings
}

function checkConfigPasswordPresence() { // Is there a configuration password configured yet?
    const [configPasswordPresence, setConfigPasswordPresence] = useState([])

    useEffect(() => {
        async function configPasswordExists() {
            let rawResponse = await fetch("/api/config-password") // See if there is a password. If not, let's create one!
            let response = await rawResponse.json()
            setConfigPasswordPresence(response)
        }

        configPasswordExists()
    }, [])

    return configPasswordPresence
}

function getLanguages() { // Get all languages
    const [languages, setLanguages] = useState([])

    useEffect(() => {
        async function fetchLanguages() {
            let rawResponse = await fetch("/api/languages")
            let response = await rawResponse.json()
            setLanguages(response)
        }

        fetchLanguages()
    }, [])

    return languages
}

function CheckAuth(props) { // Check if there is yet an authentication token and if it is ok
    let { token, error, settings, languages } = props;
    let configPassword = checkConfigPasswordPresence()

    if (configPassword.passwordExists === false) { // If no password, show a "create password" form
        return <CreateConfigPassword language={props.language} uniconf={props.uniconf} />
    } else if (!token) { // Else if no token, show a form requesting a password
        return <RequestConfigPassword language={props.language} uniconf={props.uniconf} />
    } else { // Continue to configuration
        return <ConfigForm language={props.language} uniconf={props.uniconf} confSettings={settings} error={error} languages={languages} />
    }
}

function Config(props) {
    let returnedValue
    let languages = getLanguages()
    let settings = getConfSettings()
    let oauthStatus = getOauthStatus(props.queryString)
    let configPassword = checkConfigPasswordPresence() // I hate having this here but it prevents errors, so...

    if (oauthStatus.message) {
        switch (oauthStatus.message) {
            case "OAUTH_OK": // If OAuth is complete, show the "config complete" page
                returnedValue = <ConfigComplete language={props.language} uniconf={props.uniconf} />
                break;
            case "OAUTH_REDIRECT":
                window.location.replace(oauthStatus.url); // Redirect to suggested URL
                break;
            case "REFRESH_PAGE":
                window.location.replace('/config'); // Reload page if told to refresh
                break;
            default:
                returnedValue = <ErrorPage error={translate(props.language, "page_confunknownerror")} diag={translate(props.language, "page_confunknownerrordiagspa")} errorInfo={oauthStatus} language={props.language} />
                break;
        }
    } else {
        if (oauthStatus.error == "OAUTH_FAIL" || oauthStatus.error == "NO_CONF") {
            returnedValue = <CheckAuth languages={languages.languages} token={props.cookies.configtoken} error={oauthStatus.error} configPassword={configPassword} language={props.language} uniconf={props.uniconf} settings={settings} />
        }
        // if conf ok, show 404
        // cannot connect to x? show wall with that error
        // else show error on wall

        /*
        switch (oauthStatus.error) {
            case "OAUTH_FAIL":
                returnedValue = null
                // new api endpoint
                // this might serve a similar purpose to confPage.js???
                // default-conf-settings
                // if conf ok then return CONF_OK
                // else see what the error is
                // if the error is MISSING_FIELDS then call a function that determines what settings are missing, etc
                // if the error is false then call that same function after checking interim conf to see if the conf exists
                // else, return unknown error
                // oauth has failed, show bad client secret error
                // hold up because we also need to deal with authorisation???
                break;
            case "NO_CONF":
                returnedValue = null
                // show normal conf
                break;
            case "CONF_OK":
                returnedValue = null
                // show 404 error
                break;
            case "CANNOT_CONNECT_TO_MICROSOFT":
                returnedValue = null
                // show wall with cannot connect to ms
                break;
            case "CANNOT_CONNECT_TO_DISCORD":
                returnedValue = null
                // show wall with cannot connect to discord
                break;
            case "CANNOT_CONNECT_TO_GOOGLE":
                returnedValue = null
                // show wall with cannot connect to google
                break;
            default:
                // show wall plus the respective error
                returnedValue = null
                break;
        }*/
    }
    //return(JSON.stringify(getOauthStatus()))

    if (!returnedValue) returnedValue = null;

    return returnedValue
}

module.exports = Config;