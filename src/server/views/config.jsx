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

function getOauthStatus(query) {
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

function Config(props) {
    let returnedValue

    let oauthStatus = getOauthStatus(props.queryString)

    if (oauthStatus.message) {
        switch (oauthStatus.message) {
            case "OAUTH_OK": // If OAuth is complete, show the "config complete" page
                returnedValue = <ConfigComplete language={props.language} uniconf={props.uniconf} />
                break;
            case "OAUTH_REDIRECT":
                returnedValue = null
                window.location.replace(oauthStatus.url);
                break;
            case "REFRESH_PAGE":
                returnedValue = null
                // redirect to /config
                break;
            default:
                returnedValue = null
                // show wall and message
                break;
        }
    } else {
        switch (oauthStatus.error) {
            case "OAUTH_FAIL":
                returnedValue = null
                // oauth has failed
                break;
            case "TOKEN_FAIL":
                returnedValue = null
                // show token failure
                break;
            case "NO_CONF":
                returnedValue = null
                // show normal conf
                break;
            case "CONF_OK":
                returnedValue = null
                // show 404 error
                break;
            case "BAD_CLIENT_SECRET":
                returnedValue = null
                // show bad client secret error
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
        }
    }
    //return(JSON.stringify(getOauthStatus()))

    return returnedValue
}

module.exports = Config;

//JSON.stringify(props.queryString)
/*
function Languages(langs) {
    let languageList = []
    langs.sort(function (a, b) {
        if (a[1] < b[1]) { return -1; }
        if (a[1] > b[1]) { return 1; }
        return 0;
    })
    langs.forEach(language => {
        if (language[0] == defaultlanguage) {
            languageList.push(<option selected value={language[0]} className="dropdown-option">{language[1]}</option>)
        } else {
            languageList.push(<option value={language[0]} className="dropdown-option">{language[1]}</option>)
        }
    })
    return languageList
};

function BadClientSecretError() {
    if (badclientsecret) return (<div className="alert-box danger text-wrap" id="badclientsecreterror" style={{ display: "block" }}>
        {"BAD_CLIENT_SECRET: " + translate(lang, 'page_badclientsecret', "express-engine-jsx")}<br />{translate(lang, 'page_badclientsecretdiag', "express-engine-jsx")}
    </div>)
};

function OnlineStatusOptions() {
    let statusList = []
    let statuses = ["online", "idle", "dnd", "invisible"]

    statuses.forEach(status => {
        if (defaultstatus == status) {
            statusList.push(<option selected value={status}>{translate(lang, 'page_' + status, "express-engine-jsx")}</option>)
        } else {
            statusList.push(<option value={status}>{translate(lang, 'page_' + status, "express-engine-jsx")}</option>)
        }
    })
    return (statusList)
};

function SMTPSSLOptions() {
    let SMTPOptionsList = []
    if (smtpssl) {
        SMTPOptionsList.push(<option selected value="true" >{translate(lang, 'page_dropdownyes', "express-engine-jsx")}</option>)
        SMTPOptionsList.push(<option value="false" >{translate(lang, 'page_dropdownno', "express-engine-jsx")}</option>)
    } else {
        SMTPOptionsList.push(<option value="true" >{translate(lang, 'page_dropdownyes', "express-engine-jsx")}</option>)
        SMTPOptionsList.push(<option selected value="false" >{translate(lang, 'page_dropdownno', "express-engine-jsx")}</option>)
    }
    return SMTPOptionsList
}

function IMAPSSLOptions() {
    let IMAPOptionsList = []
    if (smtpssl) {
        IMAPOptionsList.push(<option selected value="true" >{translate(lang, 'page_dropdownyes', "express-engine-jsx")}</option>)
        IMAPOptionsList.push(<option value="false" >{translate(lang, 'page_dropdownyes', "express-engine-jsx")}</option>)
    } else {
        IMAPOptionsList.push(<option value="true" >{translate(lang, 'page_dropdownyes', "express-engine-jsx")}</option>)
        IMAPOptionsList.push(<option selected value="false" >{translate(lang, 'page_dropdownyes', "express-engine-jsx")}</option>)
    }
    return IMAPOptionsList
}

<Layout>
    <script src='/resources/smc.js' />
    <script type="module">

    </script>
    <div className="global-intro-section">
        <div className="container">
            <center><h1>{translate(lang, 'page_configheader', "express-engine-jsx")}</h1></center>
        </div>
    </div>
    <div className="container" style={{ paddingTop: 0.75 + "em" }}>
        <div className="alert-box danger text-wrap" id="cannotcontactservererror">
            {"SERVER_CONNECTION_REFUSED: " + translate(lang, 'page_serverlostconnectionpart1', "express-engine-jsx") + uniconf.projname + translate(lang, 'page_serverlostconnectionpart2', "express-engine-jsx")}<br />{translate(lang, 'page_serverlostconnectiondiagpart1', "express-engine-jsx") + uniconf.projname + translate(lang, 'page_serverlostconnectiondiagpart2', "express-engine-jsx")}<a href={uniconf.discord}>{translate(lang, 'global_discorderver', "express-engine-jsx")}</a>{translate(lang, 'page_serverlostconnectiondiagpart3', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="accessdeniederror">
            {"ACCESS_DENIED: " + uniconf.projname + translate(lang, 'page_accessdenied', "express-engine-jsx")}<br />{translate(lang, 'page_accessdenieddiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="connectionrefusederror">
            {"CONNECTION_REFUSED: " + uniconf.projname + translate(lang, 'page_dbconnectionrefused', "express-engine-jsx")}<em id='userEnteredMySQLHostname'></em>.<br />{translate(lang, 'page_dbconnectionrefuseddiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="incorrectcredentialserror">
            {"INCORRECT_CREDENTIALS: " + translate(lang, 'page_dbbadcreds', "express-engine-jsx")}<br />{translate(lang, 'page_dbbadcredsdiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="redisconnectionrefusederror">
            {"REDIS_CONNECTION_REFUSED: " + translate(lang, 'page_redisconnectionrefused', "express-engine-jsx")}<em id='userEnteredRedisHostname'></em><br />{translate(lang, 'page_redisconnectionrefuseddiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="wrongpasserror">
            {"WRONGPASS: " + translate(lang, 'page_rediswrongpass', "express-engine-jsx")}<br />{translate(lang, 'page_dbbadcredsdiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="baddatabaseerror">
            {"BAD_DATABASE: " + translate(lang, 'page_redisbaddb', "express-engine-jsx")}<br />{translate(lang, 'page_redisbaddbdiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="invalidurlerror">
            {"INVALID_URL: " + translate(lang, 'page_redisinvalidurl', "express-engine-jsx")}<br />{translate(lang, 'page_redisinvalidurldiagpart1', "express-engine-jsx") + uniconf.projname + translate(lang, 'page_redisinvalidurldiagpart2', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="confokerror">
            {"CONF_OK: " + translate(lang, 'page_wrongendpoint', "express-engine-jsx")}<br />{translate(lang, 'page_wrongendpointdiagpart1', "express-engine-jsx")} <a href="/">{translate(lang, 'page_wrongendpointdiagpart2', "express-engine-jsx")}</a>{"."}
        </div>
        <div className="alert-box danger text-wrap" id="missingargserror">
            {"MISSING_ARGS: " + translate(lang, 'page_missingargs', "express-engine-jsx")}<br />{translate(lang, 'page_missingargsdiag', "express-engine-jsx")}
        </div>
        <BadClientSecretError />
        <div className="alert-box danger text-wrap" id="tokeninvaliderror">
            {"TOKEN_INVALID: " + translate(lang, 'page_tokeninvalid', "express-engine-jsx")}<br />{translate(lang, 'page_tokeninvaliddiag', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="cannotconnecttodiscorderror">
            {"CANNOT_CONNECT_TO_DISCORD: " + uniconf.projname + translate(lang, 'page_cannotconnecttodiscord', "express-engine-jsx")}<br />{translate(lang, 'page_cannotconnecttodiscorddiagpart1', "express-engine-jsx") + uniconf.projname + translate(lang, 'page_cannotconnecttodiscorddiagpart2', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="unknowndiscorderror">
            {"UNKNOWN_DISCORD_ERROR: " + translate(lang, 'page_unknowndiscorderror', "express-engine-jsx")}<br />{translate(lang, 'page_confunknownerrordiag',"express-engine-jsx")}<a href={uniconf.discord}>{translate(lang, 'global_discorderver', "express-engine-jsx")}</a>{translate(lang, 'page_serverlostconnectiondiagpart3', "express-engine-jsx")}
        </div>
        <div className="alert-box danger text-wrap" id="unknownerror">
            {"UNKNOWN_ERROR: " + translate(lang, 'page_confunknownerror', "express-engine-jsx")}<br />{translate(lang, 'page_confunknownerrordiag', "express-engine-jsx")}<a href={uniconf.discord}>{translate(lang, 'global_discorderver', "express-engine-jsx")}</a>{translate(lang, 'page_serverlostconnectiondiagpart3', "express-engine-jsx")}
        </div>
        <form id="configform">
            <div className="container">
                <div className="accordion" id="configAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="mySQLHeading">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMySQL" aria-expanded="true" aria-controls="collapseMySQL">
                                {translate(lang, 'page_configstep1', "express-engine-jsx")}
                            </button>
                        </h2>
                        <div id="collapseMySQL" className="accordion-collapse collapse show" aria-labelledby="mySQLHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='language' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_defaultlanguagelabel', "express-engine-jsx")}</label>
                                        <select className="size16-1__VVI form-select input-cIJ7To" name="language" id="language">
                                            <Languages />
                                            <option style={{ display: "none" }} value="dummy" className="dropdown-option" id="languagedropdown"></option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor='hostname' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbhostlabel', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='hostname' name='hostname' value={hostname} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='dbusername' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbusernamelabel', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='dbusername' name='dbusername' value={dbusername} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='dbpassword' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbpasswordlabel', "express-engine-jsx")}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='dbpassword' name='dbpassword' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='database' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dblabel', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='database' name='database' value={database} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='tableprefix' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbtableprefixlabel', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='tableprefix' name='tableprefix' value={tableprefix} />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#MySQL_configuration">{translate(lang, 'page_globalneedhelp', "express-engine-jsx")}</a>
                                    <div className="col">
                                        <input value={translate(lang, 'page_globalnext', "express-engine-jsx")} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRedis" aria-controls="collapseRedis" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="redisHeading">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRedis" aria-expanded="true" aria-controls="collapseRedis">
                                {translate(lang, 'page_configstep2', "express-engine-jsx")}
                            </button>
                        </h2>
                        <div id="collapseRedis" className="accordion-collapse collapse" aria-labelledby="redisHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='redishostname' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbhostlabel', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redishostname' name='redishostname' value={redishostname} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='redisusername' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbusernamelabel', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redisusername' name='redisusername' value={redisusername} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='redispassword' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbpasswordlabel', "express-engine-jsx")}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redispassword' name='redispassword' />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='redisdatabase' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dblabel', "express-engine-jsx")}</label>
                                        <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" min="0" id='redisdatabase' name='redisdatabase' value={redisdatabase} />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Redis_configuration">{translate(lang, 'page_globalneedhelp', "express-engine-jsx")}</a>
                                    <div className="col">
                                        <input value={translate(lang, 'page_globalnext', "express-engine-jsx")} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscord" aria-controls="collapseDiscord" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="discordHeading">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscord" aria-expanded="false" aria-controls="collapseDiscord">
                                {translate(lang, 'page_configstep3', "express-engine-jsx")}
                            </button>
                        </h2>
                        <div id="collapseDiscord" className="accordion-collapse collapse" aria-labelledby="discordHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='token' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_discordtoken', "express-engine-jsx")}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='token' name='token' />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='discordclientsecret' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_clientsecret', "express-engine-jsx")}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='discordclientsecret' name='discordclientsecret' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='pstatus' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_playingstatus', "express-engine-jsx")}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='pstatus' name='pstatus' value={pstatus} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='ostatus' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_status', "express-engine-jsx")}</label>
                                        <select className="form-select input-cIJ7To" name="ostatus" id="ostatus">
                                            {/*Unfortunately, I would have styled the dropdown but apparently that's not possible? If it is, please submit a pull request right away.*//*}
<OnlineStatusOptions />
</select>
</div>
</div>
<div className="row">
<div className="col">
<label htmlFor='guildid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_supportguildid', "express-engine-jsx")}</label>
<input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='guildid' name='guildid' value={guildid} />
</div>
<div className="col">
<label htmlFor='moderatorsroleid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_moderatorsroleid', "express-engine-jsx")}</label>
<input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='moderatorsroleid' name='moderatorsroleid' value={moderatorsroleid} />
</div>
</div>
<div className="row mt-3 justify-content-sm-end">
<a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Discord_configuration">{translate(lang, 'page_globalneedhelp', "express-engine-jsx")}</a>
<div className="col">
<input value={translate(lang, 'page_globalnext', "express-engine-jsx")} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCloud" aria-controls="collapseCloud" />
</div>
</div>
</div>
</div>
</div>
<div className="accordion-item">
<h2 className="accordion-header" id="cloudHeading">
<button className="accordion-button collapsed" title="yes i hate the word cloud" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCloud" aria-expanded="false" aria-controls="collapseCloud">
{translate(lang, 'page_configstep4', "express-engine-jsx")}
</button>
</h2>
<div id="collapseCloud" className="accordion-collapse collapse" aria-labelledby="cloudHeading" data-bs-parent="#configAccordion">
<div className="accordion-body">
<div className="row">
<div className="col">
<label htmlFor='googleclientid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_googleclientid', "express-engine-jsx")}</label>
<input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='googleclientid' name='googleclientid' value={googleclientid} />
</div>
<div className="col">
<label htmlFor='googleclientsecret' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_googleclientsecret', "express-engine-jsx")}</label>
<input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='googleclientsecret' name='googleclientsecret' />
</div>
</div>
<div className="row">
<div className="col">
<label htmlFor='msclientid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_msclientid', "express-engine-jsx")}</label>
<input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='msclientid' name='msclientid' value={msclientid} />
</div>
<div className="col">
<label htmlFor='msclientsecret' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_msclientsecret', "express-engine-jsx")}</label>
<input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='msclientsecret' name='msclientsecret' />
</div>
</div>
<div className="row mt-3 justify-content-sm-end">
<a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Cloud_services_configuration">{translate(lang, 'page_globalneedhelp', "express-engine-jsx")}</a>
<div className="col">
<input value={translate(lang, 'page_globalnext', "express-engine-jsx")} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEmail" aria-controls="collapseEmail" />
</div>
</div>
</div>
</div>
</div>
<div className="accordion-item">
<h2 className="accordion-header" id="emailHeading">
<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEmail" aria-expanded="false" aria-controls="collapseEmail">
{translate(lang, 'page_configstep5', "express-engine-jsx")}
</button>
</h2>
<div id="collapseEmail" className="accordion-collapse collapse" aria-labelledby="emailHeading" data-bs-parent="#configAccordion">
<div className="accordion-body">
<div className="row">
<div className="col">
<label htmlFor='smtpserver' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_smtpserver', "express-engine-jsx")}</label>
<input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='smtpserver' name='smtpserver' value={smtpserver} />
</div>
<div className="col">
<label htmlFor='smtpport' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_smtpport', "express-engine-jsx")}</label>
<input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='smtpport' name='smtpport' min="1" max="65535" value={smtpport} />
</div>
</div>
<div className="row">
<div className="col">
<label htmlFor='smtpssl' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_smtpssl', "express-engine-jsx")}</label>
<select className="form-select input-cIJ7To" name="smtpssl" id="smtpssl">
<SMTPSSLOptions />
</select>
</div>
<div className="col">
<label htmlFor='imapserver' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_imapserver', "express-engine-jsx")}</label>
<input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='imapserver' name='imapserver' value={imapserver} />
</div>
</div>
<div className="row">
<div className="col">
<label htmlFor='imapport' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_imapport', "express-engine-jsx")}</label>
<input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='imapport' name='imapport' min="1" max="65535" value={imapport} />
</div>
<div className="col">
<label htmlFor='imapssl' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_imapssl', "express-engine-jsx")}</label>
<select className="form-select input-cIJ7To" name="imapssl" id="imapssl">
<IMAPSSLOptions />
</select>
</div>
</div>
<div className="row">
<div className="col">
<label htmlFor='emailaddress' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_configemailaddress', "express-engine-jsx")}</label>
<input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailaddress' name='emailaddress' value={emailaddress} />
</div>
<div className="col">
<label htmlFor='emailusername' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_configemailusername', "express-engine-jsx")}</label>
<input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailusername' name='emailusername' value={emailusername} />
</div>
</div>
<div className="row">
<div className="col">
<label htmlFor='emailpassword' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_configemailpassword', "express-engine-jsx")}</label>
<input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailpassword' name='emailpassword' />
</div>
</div>
<div className="row mt-3 justify-content-sm-end">
<a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Email_configuration">{translate(lang, 'page_globalneedhelp', "express-engine-jsx")}</a>
<div className="col">
<input type='submit' className='submit button' value={translate(lang, "page_globalsubmit", "express-engine-jsx")} id="SubmitConfButton" />
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</form>
</div>
</Layout>
*/