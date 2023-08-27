/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: config-form.jsx                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react');
const { useState, useEffect } = require('react');
const translate = require('./components/getLanguageString');

function Languages(props) { // Add languages to list of languages
    let { langs } = props
    let languageList = []

    if (langs && langs.languages) {
        let languages = langs.languages
        languages.sort(function (a, b) { // Sort A-Z
            if (a[1] < b[1]) { return -1; }
            if (a[1] > b[1]) { return 1; }
            return 0;
        })

        let key = 0

        languages.forEach(language => { // Add each to dropdown
            languageList.push(<option value={language[0]} key={key++} className="dropdown-option">{language[1]}</option>)
        })
    }

    return languageList
};

function BadClientSecretError(props) { // Sow bad client secret error if bad client secret
    if (props.badClientSecret) {
        return <div className="alert-box danger text-wrap" id="badclientsecreterror" style={{ display: "block" }}>
            {"BAD_CLIENT_SECRET: " + translate(props.language, 'page_badclientsecret')}<br />{translate(props.language, 'page_badclientsecretdiag')}
        </div>
    } else {
        return null
    }
};

async function submitConfigForm() {
    window.event.preventDefault();
    let captureConfigSubmitFormData = document.getElementById("configform") // Get contents of the form
    let configSubmitForm = new FormData(captureConfigSubmitFormData) // Turn it into form data

    document.getElementById("cannotcontactservererror").style.display = "none"; // Hide all pre-existing errors
    document.getElementById("accessdeniederror").style.display = "none";
    document.getElementById("incorrectcredentialserror").style.display = "none";
    document.getElementById("redisconnectionrefusederror").style.display = "none";
    document.getElementById("wrongpasserror").style.display = "none";
    document.getElementById("baddatabaseerror").style.display = "none";
    document.getElementById("invalidurlerror").style.display = "none";
    document.getElementById("confokerror").style.display = "none";
    document.getElementById("missingargserror").style.display = "none";
    if (document.getElementById("badclientsecreterror") != null && typeof (document.getElementById("badclientsecreterror")) != "undefined") { // Forgot that it can be null
        document.getElementById("badclientsecreterror").style.display = "none";
    }
    document.getElementById("cannotconnecttodiscorderror").style.display = "none";
    document.getElementById("tokeninvaliderror").style.display = "none";
    document.getElementById("unknowndiscorderror").style.display = "none";
    document.getElementById("unknownerror").style.display = "none";
    document.getElementById("connectionrefusederror").style.display = "none";

    try {
        let rawResponse = await fetch('/api/submit-config', { method: "POST", body: configSubmitForm }) // Submit to API for processing
        let response = await rawResponse.json()

        if (response.response) {
            switch (response.response) {
                case "VERIFY_CLIENT_SECRET": // Reloading will mean that the user gets the second step of config
                    location.reload()
                    break;
                case "WRONG_ENDPOINT": // Show errors based on the response
                    document.getElementById("wrongendpointerror").style.display = "block";
                    break;
                case "CONF_OK":
                    document.getElementById("confokerror").style.display = "block"
                    break;
                case "INCORRECT_CREDENTIALS":
                    document.getElementById("incorrectcredentialserror").style.display = "block"
                    break;
                case "ACCESS_DENIED":
                    document.getElementById("userEnteredUsername").textContent = '\'' + response.dbusername + '\'@\'' + response.hostname + '\''
                    document.getElementById("userEnteredDatabase").textContent = response.database + '.*'
                    document.getElementById("accessdeniederror").style.display = "block"
                    break;
                case "CONNECTION_REFUSED":
                    document.getElementById("connectionrefusederror").style.display = "block"
                    document.getElementById("userEnteredMySQLHostname").textContent = response.hostname
                    break;
                case "REDIS_CONNECTION_REFUSED":
                    document.getElementById("redisconnectionrefusederror").style.display = "block"
                    document.getElementById("userEnteredRedisHostname").textContent = response.redishostname
                    break;
                case "WRONGPASS":
                    document.getElementById("wrongpasserror").style.display = "block"
                    break;
                case "BAD_DATABASE":
                    document.getElementById("baddatabaseerror").style.display = "block"
                    break;
                case "INVALID_URL":
                    document.getElementById("invalidurlerror").style.display = "block"
                    break;
                case "WRONG_ENDPOINT":
                    document.getElementById("wrongendpointerror").style.display = "block";
                    break;
                case "ACCESS_DENIED":
                    document.getElementById("accessdeniederror").style.display = "block";
                    break;
                case "NO_MYSQL_CONF":
                    document.getElementById("nomysqlconferror").style.display = "block";
                    break;
                case "CANNOT_CONNECT_TO_DISCORD":
                    document.getElementById("cannotconnecttodiscorderror").style.display = "block";
                    break;
                case "INCORRECT_CREDENTIALS":
                    document.getElementById("incorrectcredentialserror").style.display = "block";
                    break;
                case "MISSING_ARGS":
                    document.getElementById("missingargserror").style.display = "block";
                    break;
                case "CONF_OK":
                    document.getElementById("confokerror").style.display = "block";
                    break;
                case "TOKEN_INVALID":
                    document.getElementById("tokeninvaliderror").style.display = "block";
                    break;
                case "UNKNOWN_DISCORD_ERROR":
                    document.getElementById("unknowndiscorderror").style.display = "block";
                    break;
                case "INVALID_CONFIG_TOKEN": // Since the token is invalid, reload to display the enter password form
                    location.reload()
                    break;
                default:
                    document.getElementById("unknownerror").style.display = "block";
                    console.log(response)
                    break;
            }
        } else {
            console.log(response) // If no valid response, log it to the console
            document.getElementById("unknownerror").style.display = "none";
        }
    } catch (err) {
        void err
        document.getElementById("cannotcontactservererror").style.display = "block";
    }
}

function ConfigForm(props) {
    if (typeof (document) != "undefined") {
        document.title = props.uniconf.projname + " - " + translate(props.language, 'page_configpagetitle')
    }

    const { confSettings, uniconf } = props
    const [language, setLanguage] = useState(confSettings.language) // Use state and set defaults for settings
    const [hostname, setHostname] = useState(confSettings.hostname)
    const [dbusername, setDbusername] = useState(confSettings.dbusername)
    const [database, setDatabase] = useState(confSettings.database)
    const [tableprefix, setTableprefix] = useState(confSettings.tableprefix)
    const [redishostname, setRedishostname] = useState(confSettings.redishostname)
    const [redisusername, setRedisusername] = useState(confSettings.redisusername)
    const [redisdatabase, setRedisdatabase] = useState(confSettings.redisdatabase)
    const [pstatus, setPstatus] = useState(confSettings.pstatus)
    const [ostatus, setOstatus] = useState(confSettings.ostatus)
    const [guildid, setGuildid] = useState(confSettings.guildid)
    const [moderatorsroleid, setModeratorsroleid] = useState(confSettings.moderatorsroleid)
    const [googleclientid, setGoogleclientid] = useState(confSettings.googleclientid)
    const [msclientid, setMsclientid] = useState(confSettings.msclientid)
    const [smtpserver, setSmtpserver] = useState(confSettings.smtpserver)
    const [smtpport, setSmtpport] = useState(confSettings.smtpport)
    const [smtpssl, setSmtpssl] = useState(confSettings.smtpssl)
    const [imapserver, setImapserver] = useState(confSettings.imapserver)
    const [imapport, setImapport] = useState(confSettings.imapport)
    const [imapssl, setImapssl] = useState(confSettings.imapssl)
    const [emailaddress, setEmailaddress] = useState(confSettings.emailaddress)
    const [emailusername, setEmailusername] = useState(confSettings.emailusername)
    let badClientSecret

    if (props.error == "BAD_CLIENT_SECRET") {
        badClientSecret = true
    } else badClientSecret = false
    return <div>
        <div className="global-intro-section">
            <div className="container">
                <center><h1>{translate(props.language, 'page_configheader')}</h1></center>
            </div>
        </div>
        <div className="container" style={{ paddingTop: 0.75 + "em" }}>
            <div className="alert-box danger text-wrap" id="cannotcontactservererror">
                {"SERVER_CONNECTION_REFUSED: " + translate(props.language, 'page_serverlostconnectionpart1') + uniconf.projname + translate(props.language, 'page_serverlostconnectionpart2')}<br />{translate(props.language, 'page_serverlostconnectiondiagpart1') + uniconf.projname + translate(props.language, 'page_serverlostconnectiondiagpart2')}<a href={uniconf.discord}>{translate(props.language, 'global_discorderver')}</a>{translate(props.language, 'page_serverlostconnectiondiagpart3')}
            </div>
            <div className="alert-box danger text-wrap" id="accessdeniederror">
                {"ACCESS_DENIED: " + uniconf.projname + translate(props.language, 'page_accessdenied')}<br />{translate(props.language, 'page_accessdenieddiagpart1')}<em id='userEnteredDatabase'></em>{translate(props.language, 'page_accessdenieddiagpart2')}<em id='userEnteredUsername'></em>?
            </div>
            <div className="alert-box danger text-wrap" id="connectionrefusederror">
                {"CONNECTION_REFUSED: " + uniconf.projname + translate(props.language, 'page_dbconnectionrefused')}<em id='userEnteredMySQLHostname'></em>.<br />{translate(props.language, 'page_dbconnectionrefuseddiag')}
            </div>
            <div className="alert-box danger text-wrap" id="incorrectcredentialserror">
                {"INCORRECT_CREDENTIALS: " + translate(props.language, 'page_dbbadcreds')}<br />{translate(props.language, 'page_dbbadcredsdiag')}
            </div>
            <div className="alert-box danger text-wrap" id="redisconnectionrefusederror">
                {"REDIS_CONNECTION_REFUSED: " + translate(props.language, 'page_redisconnectionrefused')}<em id='userEnteredRedisHostname'></em><br />{translate(props.language, 'page_redisconnectionrefuseddiag')}
            </div>
            <div className="alert-box danger text-wrap" id="wrongpasserror">
                {"WRONGPASS: " + translate(props.language, 'page_rediswrongpass')}<br />{translate(props.language, 'page_dbbadcredsdiag')}
            </div>
            <div className="alert-box danger text-wrap" id="baddatabaseerror">
                {"BAD_DATABASE: " + translate(props.language, 'page_redisbaddb')}<br />{translate(props.language, 'page_redisbaddbdiag')}
            </div>
            <div className="alert-box danger text-wrap" id="invalidurlerror">
                {"INVALID_URL: " + translate(props.language, 'page_redisinvalidurl')}<br />{translate(props.language, 'page_redisinvalidurldiagpart1') + uniconf.projname + translate(props.language, 'page_redisinvalidurldiagpart2')}
            </div>
            <div className="alert-box danger text-wrap" id="confokerror">
                {"CONF_OK: " + translate(props.language, 'page_wrongendpoint')}<br />{translate(props.language, 'page_wrongendpointdiagpart1')} <a href="/">{translate(props.language, 'page_wrongendpointdiagpart2')}</a>{"."}
            </div>
            <div className="alert-box danger text-wrap" id="missingargserror">
                {"MISSING_ARGS: " + translate(props.language, 'page_missingargs')}<br />{translate(props.language, 'page_missingargsdiag')}
            </div>
            <BadClientSecretError language={props.language} badClientSecret={badClientSecret} />
            <div className="alert-box danger text-wrap" id="tokeninvaliderror">
                {"TOKEN_INVALID: " + translate(props.language, 'page_tokeninvalid')}<br />{translate(props.language, 'page_tokeninvaliddiag')}
            </div>
            <div className="alert-box danger text-wrap" id="cannotconnecttodiscorderror">
                {"CANNOT_CONNECT_TO_DISCORD: " + uniconf.projname + translate(props.language, 'page_cannotconnecttodiscord')}<br />{translate(props.language, 'page_cannotconnecttodiscorddiagpart1') + uniconf.projname + translate(props.language, 'page_cannotconnecttodiscorddiagpart2')}
            </div>
            <div className="alert-box danger text-wrap" id="unknowndiscorderror">
                {"UNKNOWN_DISCORD_ERROR: " + translate(props.language, 'page_unknowndiscorderror')}<br />{translate(props.language, 'page_confunknownerrordiag')}<a href={uniconf.discord}>{translate(props.language, 'global_discorderver')}</a>{translate(props.language, 'page_serverlostconnectiondiagpart3')}
            </div>
            <div className="alert-box danger text-wrap" id="unknownerror">
                {"UNKNOWN_ERROR: " + translate(props.language, 'page_confunknownerror')}<br />{translate(props.language, 'page_confunknownerrordiag')}<a href={uniconf.discord}>{translate(props.language, 'global_discorderver')}</a>{translate(props.language, 'page_serverlostconnectiondiagpart3')}
            </div>
            <form id="configform">
                <div className="container">
                    <div className="accordion" id="configAccordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="mySQLHeading">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMySQL" aria-expanded="true" aria-controls="collapseMySQL">
                                    {translate(props.language, 'page_configstep1')}
                                </button>
                            </h2>
                            <div id="collapseMySQL" className="accordion-collapse collapse show" aria-labelledby="mySQLHeading" data-bs-parent="#configAccordion">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='language' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_defaultlanguagelabel')}</label>
                                            <select className="size16-1__VVI form-select input-cIJ7To" name="language" id="language" value={language} onChange={e => setLanguage(e.target.value)}> {/* REMEMBER TO CREATE DEFAULTS FOR LANG*/}
                                                <Languages langs={props.languages} />
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor='hostname' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbhostlabel')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='hostname' name='hostname' value={hostname} onChange={e => setHostname(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='dbusername' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbusernamelabel')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='dbusername' name='dbusername' value={dbusername} onChange={e => setDbusername(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='dbpassword' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbpasswordlabel')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='dbpassword' name='dbpassword' />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='database' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dblabel')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='database' name='database' value={database} onChange={e => setDatabase(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='tableprefix' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbtableprefixlabel')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='tableprefix' name='tableprefix' value={tableprefix} onChange={e => setTableprefix(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-sm-end">
                                        <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#MySQL_configuration">{translate(props.language, 'page_globalneedhelp')}</a>
                                        <div className="col">
                                            <input value={translate(props.language, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRedis" aria-controls="collapseRedis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="redisHeading">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRedis" aria-expanded="true" aria-controls="collapseRedis">
                                    {translate(props.language, 'page_configstep2')}
                                </button>
                            </h2>
                            <div id="collapseRedis" className="accordion-collapse collapse" aria-labelledby="redisHeading" data-bs-parent="#configAccordion">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='redishostname' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbhostlabel')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redishostname' name='redishostname' value={redishostname} onChange={e => setRedishostname(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='redisusername' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbusernamelabel')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redisusername' name='redisusername' value={redisusername} onChange={e => setRedisusername(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='redispassword' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dbpasswordlabel')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redispassword' name='redispassword' />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='redisdatabase' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_dblabel')}</label>
                                            <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" min="0" id='redisdatabase' name='redisdatabase' value={redisdatabase} onChange={e => setRedisdatabase(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-sm-end">
                                        <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Redis_configuration">{translate(props.language, 'page_globalneedhelp')}</a>
                                        <div className="col">
                                            <input value={translate(props.language, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscord" aria-controls="collapseDiscord" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="discordHeading">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscord" aria-expanded="false" aria-controls="collapseDiscord">
                                    {translate(props.language, 'page_configstep3')}
                                </button>
                            </h2>
                            <div id="collapseDiscord" className="accordion-collapse collapse" aria-labelledby="discordHeading" data-bs-parent="#configAccordion">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='token' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_discordtoken')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='token' name='token' />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='discordclientsecret' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_clientsecret')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='discordclientsecret' name='discordclientsecret' />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='pstatus' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_playingstatus')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='pstatus' name='pstatus' value={pstatus} onChange={e => setPstatus(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='ostatus' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_status')}</label>
                                            <select className="form-select input-cIJ7To" name="ostatus" id="ostatus" defaultValue={ostatus} onChange={e => setOstatus(e.target.value)}>
                                                {/*Unfortunately, I would have styled the dropdown but apparently that's not possible? If it is, please submit a pull request right away.*/}
                                                <option key={0} value={"online"}>{translate(props.language, 'page_online')}</option>
                                                <option key={1} value={"idle"}>{translate(props.language, 'page_idle')}</option>
                                                <option key={2} value={"dnd"}>{translate(props.language, 'page_dnd')}</option>
                                                <option key={3} value={"invisible"}>{translate(props.language, 'page_invisible')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='guildid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_supportguildid')}</label>
                                            <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='guildid' name='guildid' value={guildid} onChange={e => setGuildid(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='moderatorsroleid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_moderatorsroleid')}</label>
                                            <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='moderatorsroleid' name='moderatorsroleid' value={moderatorsroleid} onChange={e => setModeratorsroleid(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-sm-end">
                                        <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Discord_configuration">{translate(props.language, 'page_globalneedhelp')}</a>
                                        <div className="col">
                                            <input value={translate(props.language, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCloud" aria-controls="collapseCloud" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="cloudHeading">
                                <button className="accordion-button collapsed" title="yes i hate the word cloud" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCloud" aria-expanded="false" aria-controls="collapseCloud">
                                    {translate(props.language, 'page_configstep4')}
                                </button>
                            </h2>
                            <div id="collapseCloud" className="accordion-collapse collapse" aria-labelledby="cloudHeading" data-bs-parent="#configAccordion">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='googleclientid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_googleclientid')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='googleclientid' name='googleclientid' value={googleclientid} onChange={e => setGoogleclientid(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='googleclientsecret' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_googleclientsecret')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='googleclientsecret' name='googleclientsecret' />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='msclientid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_msclientid')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='msclientid' name='msclientid' value={msclientid} onChange={e => setMsclientid(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='msclientsecret' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_msclientsecret')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='msclientsecret' name='msclientsecret' />
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-sm-end">
                                        <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Cloud_services_configuration">{translate(props.language, 'page_globalneedhelp')}</a>
                                        <div className="col">
                                            <input value={translate(props.language, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEmail" aria-controls="collapseEmail" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="emailHeading">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEmail" aria-expanded="false" aria-controls="collapseEmail">
                                    {translate(props.language, 'page_configstep5')}
                                </button>
                            </h2>
                            <div id="collapseEmail" className="accordion-collapse collapse" aria-labelledby="emailHeading" data-bs-parent="#configAccordion">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='smtpserver' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_smtpserver')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='smtpserver' name='smtpserver' value={smtpserver} onChange={e => setSmtpserver(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='smtpport' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_smtpport')}</label>
                                            <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='smtpport' name='smtpport' min="1" max="65535" value={smtpport} onChange={e => setSmtpport(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='smtpssl' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_smtpssl')}</label>
                                            <select className="form-select input-cIJ7To" name="smtpssl" id="smtpssl" value={smtpssl} onChange={e => setSmtpssl(e.target.value)}>
                                                    <option key={0} value="true">{translate(props.language, 'page_dropdownyes')}</option>
                                                    <option key={1} value="false">{translate(props.language, 'page_dropdownno')}</option>
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor='imapserver' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_imapserver')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='imapserver' name='imapserver' value={imapserver} onChange={e => setImapserver(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='imapport' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_imapport')}</label>
                                            <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='imapport' name='imapport' min="1" max="65535" value={imapport} onChange={e => setImapport(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='imapssl' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_imapssl')}</label>
                                            <select className="form-select input-cIJ7To" name="imapssl" id="imapssl" value={imapssl} onChange={e => setImapssl(e.target.value)}>
                                                <option key={0} value="true">{translate(props.language, 'page_dropdownyes')}</option>
                                                <option key={1} value="false">{translate(props.language, 'page_dropdownno')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='emailaddress' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_configemailaddress')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailaddress' name='emailaddress' value={emailaddress} onChange={e => setEmailaddress(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor='emailusername' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_configemailusername')}</label>
                                            <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailusername' name='emailusername' value={emailusername} onChange={e => setEmailusername(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor='emailpassword' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, 'page_configemailpassword')}</label>
                                            <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailpassword' name='emailpassword' />
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-sm-end">
                                        <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Email_configuration">{translate(props.language, 'page_globalneedhelp')}</a>
                                        <div className="col">
                                            <input type='submit' className='submit button' value={translate(props.language, "page_globalsubmit")} id="SubmitConfButton" onClick={submitConfigForm} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
}

module.exports = ConfigForm