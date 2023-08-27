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

function getLanguages() { // Get languages
    const [languages, setLanguages] = useState(null)

    useEffect(() => {
        async function fetchLanguages() {
            let rawResponse = await fetch("/api/languages") // See if there is a password. If not, let's create one!
            let response = await rawResponse.json()
            setLanguages(response)
        }

        fetchLanguages()
    }, [])

    return languages
}

function CheckAuth(props) { // Check if there is yet an authentication token and if it is ok
    const languages = getLanguages()

    let { token, error, settings } = props;
    let configPassword = checkConfigPasswordPresence()

    if (configPassword.passwordExists === false) { // If no password, show a "create password" form
        return <CreateConfigPassword language={props.language} uniconf={props.uniconf} />
    } else if (settings.error) { // Else if no token, show a form requesting a password
        if (configPassword.passwordExists === true) {
            return <RequestConfigPassword language={props.language} uniconf={props.uniconf} /> // Prevent any kind of flashing of the wrong view
        } else {
            return <CreateConfigPassword language={props.language} uniconf={props.uniconf} />
        }
    } else if (!settings.error) { // Continue to configuration
        return <ConfigForm language={props.language} uniconf={props.uniconf} confSettings={settings} error={error} languages={languages} />
    } else return null
}

function Config(props) {
    let returnedValue
    let settings = getConfSettings()
    let oauthStatus = getOauthStatus(props.queryString)

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
        if (oauthStatus.error == "OAUTH_FAIL" || oauthStatus.error == "NO_CONF") { // Validate authentication if no conf or OAuth fail, else show wall (or if conf exists, show 404)
            returnedValue = <CheckAuth token={props.cookies.configtoken} error={oauthStatus.error} language={props.language} uniconf={props.uniconf} settings={settings} />
        } else if (oauthStatus.error == "CONF_OK") {
            returnedValue = <Error404 language={props.language} confErr={props.confErr} uniconf={props.uniconf} />
        } else if (oauthStatus.error == "CANNOT_CONNECT_TO_MICROSOFT") {
            returnedValue = <ErrorPage error={props.uniconf.projname + translate(props.language, 'page_wallcannotconnecttomicrosoft')} diag={translate(props.language, 'page_wallcannotconnecttomicrosoftdiagpart1') + props.uniconf.projname + translate(props.language, 'page_wallcannotconnecttomicrosoftdiagpart2')} />
        } else if (oauthStatus.error == "CANNOT_CONNECT_TO_DISCORD") {
            returnedValue = <ErrorPage error={props.uniconf.projname + translate(props.language, 'page_wallcannotconnecttodiscord')} diag={translate(props.language, 'page_wallcannotconnecttodiscorddiagpart1') + props.uniconf.projname + translate(props.language, 'page_wallcannotconnecttodiscorddiagpart2')} />
        } else if (oauthStatus.error == "CANNOT_CONNECT_TO_GOOGLE") {
            returnedValue = <ErrorPage error={props.uniconf.projname + translate(props.language, 'page_wallcannotconnecttogoogle')} diag={translate(props.language, 'page_wallcannotconnecttogooglediagpart1') + props.uniconf.projname + translate(props.language, 'page_wallcannotconnecttogooglediagpart2')} />
        } else if (!Array.isArray(oauthStatus)) {
            returnedValue = <ErrorPage error={translate(props.language, 'page_confunknownerror')} diag={translate(props.language, "page_confunknownerrordiagspa")} errorInfo={oauthStatus} language={props.language} />
        }
    }

    if (!returnedValue) returnedValue = null;

    return returnedValue
}

module.exports = Config;