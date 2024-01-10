/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//         File: enter-configuration-password.jsx          //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')
const translate = require('./components/getLanguageString')

async function submitPassword() {
    try {
        window.event.preventDefault();
        let passwordSubmitForm = document.getElementById("submit-config-password-form") // Get contents of the form
        let passwordSubmitFormData = new FormData(passwordSubmitForm) // Turn it into form data

        let rawResponse = await fetch('/api/config-password/submit', { method: "POST", body: passwordSubmitFormData }) // Send the data
        let response = await rawResponse.json()

        document.getElementById("confpassnopassconfigurederr").style.display = "none"; // Hide all pre-existing errors
        document.getElementById("confpassmissfieldserr").style.display = "none";
        document.getElementById("confpassauthfailederr").style.display = "none";
        document.getElementById("confpassunknownerr").style.display = "none";
        if (response.error) { // If error, display the error
            switch (response.error) {
                case "NO_PASSWORD_CONFIGURED":
                    document.getElementById("confpassnopassconfigurederr").style.display = "block";
                    break;
                case "MISSING_FIELDS":
                    document.getElementById("confpassmissfieldserr").style.display = "block";
                    break;
                case "AUTH_FAILED":
                    document.getElementById("confpassauthfailederr").style.display = "block";
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

function RequestConfigPassword(props) {
    return <div>
        <title>{props.uniconf.projname + " - " + translate(props.language, 'page_configpagetitle')}</title>
        <h1 className="global-intro-section">
            <center>{translate(props.language, 'page_configheader')}</center>
        </h1>
        <div className="position-absolute start-50 translate-middle-x config-signin-card" id="config-createpassword-card">
            <div className="card card-body position-absolute top-50 start-50 translate-middle" style={{ width: 100 + "%", height: "max-content", }}>
                <h3 className="card-title"><center>{translate(props.language, 'page_configauthenticationtitle')}</center></h3>
                <div className="alert-box danger text-wrap" id="confpassnopassconfigurederr">
                    {translate(props.language, 'page_configpasswordnopassconfigured')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassmissfieldserr">
                    {translate(props.language, 'page_configpasswordmissingfields')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassauthfailederr">
                    {translate(props.language, 'page_configpasswordauthfailed')}
                </div>
                <div className="alert-box danger text-wrap" id="confpassunknownerr">
                    {translate(props.language, 'page_configpasswordsunknownerror')}
                </div>
                <form id="submit-config-password-form">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="password" className="label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz">{translate(props.language, "page_configpassword")}</label>
                            <input type="password" className="inputDefault-_djjkz input-cIJ7To size16-1__VVI" style={{ width: 100 + "%" }} id="password" name="password" />
                        </div>
                    </div>
                    <div className="row">
                        <a href="https://wiki.btsbot.439bananas.com/wiki/Installing#Configuration_password">{translate(props.language, "page_globalneedhelp")}</a>
                    </div>
                    <div className="row">
                        <div className="col" style={{ paddingTop: 20 + "px", }}>
                            <button type="submit" style={{ margin: 0 + " auto" }} onClick={submitPassword} id="SubmitConfigPwdSubmit" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                                <div className="contents-18-Yxp">{translate(props.language, "page_globalsubmit")}</div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

module.exports = RequestConfigPassword