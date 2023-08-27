/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//         File: create-configuration-password.jsx         //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')
const translate = require('./components/getLanguageString')

async function submitCreatePassword() { // Handles form for submitting password
    try {
        window.event.preventDefault();
        let passwordCreateForm = document.getElementById("create-config-password-form") // Get contents of the form
        let passwordCreateFormData = new FormData(passwordCreateForm) // Turn it into form data

        let rawResponse = await fetch('/api/config-password/create', { method: "POST", body: passwordCreateFormData }) // Send the data
        let response = await rawResponse.json()

        document.getElementById("confpassreqsnotmeterr").style.display = "none"; // Hide all pre-existing errors
        document.getElementById("configpasssexistserror").style.display = "none";
        document.getElementById("confpassconfokerr").style.display = "none";
        document.getElementById("confpassmissfieldserr").style.display = "none";
        document.getElementById("confpassnomatcherr").style.display = "none";
        document.getElementById("confpassunknownerr").style.display = "none";
        if (response.error) { // If error, display the error
            switch (response.error) {
                case "PASSWORD_EXISTS":
                    document.getElementById("configpasssexistserror").style.display = "block";
                    break;
                case "CONF_OK":
                    document.getElementById("confpassconfokerr").style.display = "block";
                    break;
                case "MISSING_FIELDS":
                    document.getElementById("confpassmissfieldserr").style.display = "block";
                    break;
                case "PASSWORD_REQIREMENTS_NOT_MET":
                    document.getElementById("confpassreqsnotmeterr").style.display = "block";
                    break;
                case "NON_MATCHING_PASSWORDS":
                    document.getElementById("confpassnomatcherr").style.display = "block";
                    break;
                default:
                    document.getElementById("confpassunknownerr").style.display = "block";
                    break;
            }
        } else if (response.message) { // Else, refresh the page
            window.location.replace("/config")
        } else { // If neither acknowledgement or error, unknown error has happened
            console.log(response)
            document.getElementById("confpassunknownerr").style.display = "block";
        }
    } catch (err) {
        console.log(err)
    }
}

function CreateConfigPassword(props) {
    return <div>
        <title>{props.uniconf.projname + " - " + translate(props.language, 'page_configpagetitle')}</title>
        <h1 className="global-intro-section">
            <center>{translate(props.language, 'page_configheader')}</center>
        </h1>
        <div className="position-absolute start-50 translate-middle-x config-signin-card" id="config-createpassword-card">
            <div className="card card-body position-absolute top-50 start-50 translate-middle" style={{ width: 100 + "%", height: "max-content", }}>
                <h3 className="card-title"><center>{translate(props.language, 'page_configauthenticationtitle')}</center></h3>
                <div className="alert-box danger text-wrap" id="confpassreqsnotmeterr">
                    {translate(props.language, 'page_configpasswordrequirementsnotmet')}
                </div>
                <div className="alert-box danger text-wrap" id="configpasssexistserror">
                    {translate(props.language, 'page_configpasswordexists')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassconfokerr">
                    {translate(props.language, 'page_configpasswordconfok')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassmissfieldserr">
                    {translate(props.language, 'page_configpasswordmissingfields')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassnomatcherr">
                    {translate(props.language, 'page_configpasswordsnonmatching')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassunknownerr">
                    {translate(props.language, 'page_configpasswordsunknownerror')}
                </div>
                <form id="create-config-password-form">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="password" className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, "page_configpassword")}</label>
                            <input type="password" autoComplete="new-password" className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" style={{ width: 100 + "%" }} id="password" name="password" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="passwordrepeat" className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, "page_configreenterpassword")}</label>
                            <input type="password" autoComplete="new-password" className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" style={{ width: 100 + "%" }} id="passwordrepeat" name="passwordrepeat" />
                        </div>
                    </div>
                    <div className="row">
                        <a href="https://wiki.btsbot.439bananas.com/wiki/Installing#Configuration_password">{translate(props.language, "page_globalneedhelp")}</a>
                    </div>
                    <div className="row">
                        <div className="col" style={{ paddingTop: 20 + "px", }}>
                            <button type="submit" style={{ margin: 0 + " auto" }} onClick={submitCreatePassword} id="CreateConfigPwdSubmit" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                                <div className="contents-18-Yxp">{translate(props.language, "page_globalsubmit")}</div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

module.exports = CreateConfigPassword