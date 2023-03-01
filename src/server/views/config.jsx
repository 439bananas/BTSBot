/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: config.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');
const translate = require('../../core/getLanguageString');

function Languages() {
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
        {"BAD_CLIENT_SECRET: " + translate(lang, 'page_badclientsecret')}<br />{translate(lang, 'page_badclientsecretdiag')}
    </div>)
};

function OnlineStatusOptions() {
    let statusList = []
    let statuses = ["online", "idle", "dnd", "invisible"]

    statuses.forEach(status => {
        if (defaultstatus == status) {
            statusList.push(<option selected value={status}>{translate(lang, 'page_' + status)}</option>)
        } else {
            statusList.push(<option value={status}>{translate(lang, 'page_' + status)}</option>)
        }
    })
    return (statusList)
};

function SMTPSSLOptions() {
    let SMTPOptionsList = []
    if (smtpssl) {
        SMTPOptionsList.push(<option selected value="true" >{translate(lang, 'page_dropdownyes')}</option>)
        SMTPOptionsList.push(<option value="false" >{translate(lang, 'page_dropdownno')}</option>)
    } else {
        SMTPOptionsList.push(<option value="true" >{translate(lang, 'page_dropdownyes')}</option>)
        SMTPOptionsList.push(<option selected value="false" >{translate(lang, 'page_dropdownno')}</option>)
    }
    return SMTPOptionsList
}

function IMAPSSLOptions() {
    let IMAPOptionsList = []
    if (smtpssl) {
        IMAPOptionsList.push(<option selected value="true" >{translate(lang, 'page_dropdownyes')}</option>)
        IMAPOptionsList.push(<option value="false" >{translate(lang, 'page_dropdownyes')}</option>)
    } else {
        IMAPOptionsList.push(<option value="true" >{translate(lang, 'page_dropdownyes')}</option>)
        IMAPOptionsList.push(<option selected value="false" >{translate(lang, 'page_dropdownyes')}</option>)
    }
    return IMAPOptionsList
}

<Layout>
    <script src='/resources/smc.js' />
    <script type="module">

    </script>
    <div className="global-intro-section">
        <div className="container">
            <center><h1>{translate(lang, 'page_configheader')}</h1></center>
        </div>
    </div>
    <div className="container" style={{ paddingTop: 0.75 + "em" }}>
        <div className="alert-box danger text-wrap" id="cannotcontactservererror">
            {"SERVER_CONNECTION_REFUSED: " + translate(lang, 'page_serverlostconnectionpart1') + uniconf.projname + translate(lang, 'page_serverlostconnectionpart2')}<br />{translate(lang, 'page_serverlostconnectiondiagpart1') + uniconf.projname + translate(lang, 'page_serverlostconnectiondiagpart2')}<a href={uniconf.discord}>{translate(lang, 'global_discorderver')}</a>{translate(lang, 'page_serverlostconnectiondiagpart3')}
        </div>
        <div className="alert-box danger text-wrap" id="accessdeniederror">
            {"ACCESS_DENIED: " + uniconf.projname + translate(lang, 'page_accessdenied')}<br />{translate(lang, 'page_accessdenieddiag')}
        </div>
        <div className="alert-box danger text-wrap" id="connectionrefusederror">
            {"CONNECTION_REFUSED: " + uniconf.projname + translate(lang, 'page_dbconnectionrefused')}<em id='userEnteredMySQLHostname'></em>.<br />{translate(lang, 'page_dbconnectionrefuseddiag')}
        </div>
        <div className="alert-box danger text-wrap" id="incorrectcredentialserror">
            {"INCORRECT_CREDENTIALS: " + translate(lang, 'page_dbbadcreds')}<br />{translate(lang, 'page_dbbadcredsdiag')}
        </div>
        <div className="alert-box danger text-wrap" id="redisconnectionrefusederror">
            {"REDIS_CONNECTION_REFUSED: " + translate(lang, 'page_redisconnectionrefused')}<em id='userEnteredRedisHostname'></em><br />{translate(lang, 'page_redisconnectionrefuseddiag')}
        </div>
        <div className="alert-box danger text-wrap" id="wrongpasserror">
            {"WRONGPASS: " + translate(lang, 'page_rediswrongpass')}<br />{translate(lang, 'page_dbbadcredsdiag')}
        </div>
        <div className="alert-box danger text-wrap" id="baddatabaseerror">
            {"BAD_DATABASE: " + translate(lang, 'page_redisbaddb')}<br />{translate(lang, 'page_redisbaddbdiag')}
        </div>
        <div className="alert-box danger text-wrap" id="invalidurlerror">
            {"INVALID_URL: " + translate(lang, 'page_redisinvalidurl')}<br />{translate(lang, 'page_redisinvalidurldiagpart1') + uniconf.projname + translate(lang, 'page_redisinvalidurldiagpart2')}
        </div>
        <div className="alert-box danger text-wrap" id="confokerror">
            {"CONF_OK: " + translate(lang, 'page_wrongendpoint')}<br />{translate(lang, 'page_wrongendpointdiagpart1')} <a href="/">{translate(lang, 'page_wrongendpointdiagpart2')}</a>{"."}
        </div>
        <BadClientSecretError />
        <div className="alert-box danger text-wrap" id="tokeninvaliderror">
            {"TOKEN_INVALID: " + translate(lang, 'page_tokeninvalid')}<br />{translate(lang, 'page_tokeninvaliddiag')}
        </div>
        <div className="alert-box danger text-wrap" id="cannotconnecttodiscorderror">
            {"CANNOT_CONNECT_TO_DISCORD: " + uniconf.projname + translate(lang, 'page_cannotconnecttodiscord')}<br />{translate(lang, 'page_cannotconnecttodiscorddiagpart1') + uniconf.projname + translate(lang, 'page_cannotconnecttodiscorddiagpart2')}
        </div>
        <div className="alert-box danger text-wrap" id="unknowndiscorderror">
            {"UNKNOWN_DISCORD_ERROR: " + translate(lang, 'page_unknowndiscorderror')}<br />{translate(lang, 'page_confunknownerrordiag')}<a href={uniconf.discord}>{translate(lang, 'global_discorderver')}</a>{translate(lang, 'page_serverlostconnectiondiagpart3')}
        </div>
        <div className="alert-box danger text-wrap" id="unknownerror">
            {"UNKNOWN_ERROR: " + translate(lang, 'page_confunknownerror')}<br />{translate(lang, 'page_confunknownerrordiag')}<a href={uniconf.discord}>{translate(lang, 'global_discorderver')}</a>{translate(lang, 'page_serverlostconnectiondiagpart3')}
        </div>
        <form id="configform">
            <div className="container">
                <div className="accordion" id="configAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="mySQLHeading">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMySQL" aria-expanded="true" aria-controls="collapseMySQL">
                                {translate(lang, 'page_configstep1')}
                            </button>
                        </h2>
                        <div id="collapseMySQL" className="accordion-collapse collapse show" aria-labelledby="mySQLHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='language' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_defaultlanguagelabel')}</label>
                                        <select className="size16-1__VVI form-select input-cIJ7To" name="language" id="language">
                                            <Languages />
                                            <option style={{ display: "none" }} value="dummy" className="dropdown-option" id="languagedropdown"></option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor='hostname' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbhostlabel')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='hostname' name='hostname' value={hostname} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='dbusername' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbusernamelabel')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='dbusername' name='dbusername' value={dbusername} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='dbpassword' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbpasswordlabel')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='dbpassword' name='dbpassword' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='database' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dblabel')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='database' name='database' value={database} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='tableprefix' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbtableprefixlabel')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='tableprefix' name='tableprefix' value={tableprefix} />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#MySQL_configuration">{translate(lang, 'page_globalneedhelp')}</a>
                                    <div className="col">
                                        <input value={translate(lang, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRedis" aria-controls="collapseRedis" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="redisHeading">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRedis" aria-expanded="true" aria-controls="collapseRedis">
                                {translate(lang, 'page_configstep2')}
                            </button>
                        </h2>
                        <div id="collapseRedis" className="accordion-collapse collapse" aria-labelledby="redisHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='redishostname' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbhostlabel')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redishostname' name='redishostname' value={redishostname} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='redisusername' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbusernamelabel')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redisusername' name='redisusername' value={redisusername} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='redispassword' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dbpasswordlabel')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='redispassword' name='redispassword' />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='redisdatabase' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_dblabel')}</label>
                                        <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" min="0" id='redisdatabase' name='redisdatabase' value={redisdatabase} />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Redis_configuration">{translate(lang, 'page_globalneedhelp')}</a>
                                    <div className="col">
                                        <input value={translate(lang, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscord" aria-controls="collapseDiscord" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="discordHeading">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscord" aria-expanded="false" aria-controls="collapseDiscord">
                                {translate(lang, 'page_configstep3')}
                            </button>
                        </h2>
                        <div id="collapseDiscord" className="accordion-collapse collapse" aria-labelledby="discordHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='token' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_discordtoken')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='token' name='token' />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='discordclientsecret' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_clientsecret')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='discordclientsecret' name='discordclientsecret' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='pstatus' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_playingstatus')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='pstatus' name='pstatus' value={pstatus} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='ostatus' className="required label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_status')}</label>
                                        <select className="form-select input-cIJ7To" name="ostatus" id="ostatus">
                                            {/*Unfortunately, I would have styled the dropdown but apparently that's not possible? If it is, please submit a pull request right away.*/}
                                            <OnlineStatusOptions />
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='guildid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_supportguildid')}</label>
                                        <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='guildid' name='guildid' value={guildid} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='moderatorsroleid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_moderatorsroleid')}</label>
                                        <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='moderatorsroleid' name='moderatorsroleid' value={moderatorsroleid} />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Discord_configuration">{translate(lang, 'page_globalneedhelp')}</a>
                                    <div className="col">
                                        <input value={translate(lang, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCloud" aria-controls="collapseCloud" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="cloudHeading">
                            <button className="accordion-button collapsed" title="yes i hate the word cloud" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCloud" aria-expanded="false" aria-controls="collapseCloud">
                                {translate(lang, 'page_configstep4')}
                            </button>
                        </h2>
                        <div id="collapseCloud" className="accordion-collapse collapse" aria-labelledby="cloudHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='googleclientid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_googleclientid')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='googleclientid' name='googleclientid' value={googleclientid} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='googleclientsecret' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_googleclientsecret')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='googleclientsecret' name='googleclientsecret' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='msclientid' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_msclientid')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='msclientid' name='msclientid' value={msclientid} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='msclientsecret' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_msclientsecret')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='msclientsecret' name='msclientsecret' />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Cloud_services_configuration">{translate(lang, 'page_globalneedhelp')}</a>
                                    <div className="col">
                                        <input value={translate(lang, 'page_globalnext')} aria-expanded="false" className="button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEmail" aria-controls="collapseEmail" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="emailHeading">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEmail" aria-expanded="false" aria-controls="collapseEmail">
                                {translate(lang, 'page_configstep5')}
                            </button>
                        </h2>
                        <div id="collapseEmail" className="accordion-collapse collapse" aria-labelledby="emailHeading" data-bs-parent="#configAccordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='smtpserver' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_smtpserver')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='smtpserver' name='smtpserver' value={smtpserver} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='smtpport' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_smtpport')}</label>
                                        <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='smtpport' name='smtpport' min="1" max="65535" value={smtpport} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='smtpssl' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_smtpssl')}</label>
                                        <select className="form-select input-cIJ7To" name="smtpssl" id="smtpssl">
                                            <SMTPSSLOptions />
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor='imapserver' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_imapserver')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='imapserver' name='imapserver' value={imapserver} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='imapport' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_imapport')}</label>
                                        <input type='number' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='imapport' name='imapport' min="1" max="65535" value={imapport} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='imapssl' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_imapssl')}</label>
                                        <select className="form-select input-cIJ7To" name="imapssl" id="imapssl">
                                            <IMAPSSLOptions />
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='emailaddress' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_configemailaddress')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailaddress' name='emailaddress' value={emailaddress} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='emailusername' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_configemailusername')}</label>
                                        <input type='text' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailusername' name='emailusername' value={emailusername} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor='emailpassword' className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(lang, 'page_configemailpassword')}</label>
                                        <input type='password' className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" id='emailpassword' name='emailpassword' />
                                    </div>
                                </div>
                                <div className="row mt-3 justify-content-sm-end">
                                    <a target="_blank" href="https://wiki.btsbot.439bananas.com/wiki/Installing#Email_configuration">{translate(lang, 'page_globalneedhelp')}</a>
                                    <div className="col">
                                        <input type='submit' className='submit button' value={translate(lang, "page_globalsubmit")} id="SubmitConfButton" />
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