/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: no-conf-intro.jsx                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const translate = require('./components/getLanguageString');
const React = require('react');
const log = require('./components/logHandler')
const { useState, useEffect } = require('react')

function getConfig() {
    const [confInfo, setConfInfo] = useState([])

    useEffect(() => {
        async function fetchConfInfo() {
            /*if (typeof(uniconf) !== "undefined") {
                setConfInfo("uniconf exists")
            } else {
                setConfInfo("uniconf does not exist")
            }*/
            let rawResponse = await fetch("/api/conf")
            let response = await rawResponse.json()
            setConfInfo(response)
        }

        fetchConfInfo()
    }, [])

    return confInfo
    // i have reason to believe that we call an api endpoint that grabs the instance's config
    // but that may not always be the case, sometimes this may be called via staticrouter
    // in which case it's best if we check if something like uniconf exists, if it does not then try and jerry rig something together

    // here's what we can do within the api:
    // does the conf exist? no? what's the error?
    // if the error is "ACCESS_DENIED", send back the db, username and hostname

    // if uniconf exists, then do what the api does right back at ya
}

function ErrorDiag(props) {
    let errorDiag
    if (!props.err) {
        errorDiag = translate(props.language, 'page_noconfintrodiag')
    } else {
        switch (props.err) {
            case "MISSING_FIELDS":
                errorDiag = translate(props.language, 'page_noconfintrodiag')
            case "TOKEN_INVALID":
                errorDiag = translate(props.language, 'page_noconfintrobadtokendiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintrobadtokendiagpart2')
            case "CONNECTION_REFUSED":
                errorDiag = translate(props.language, 'page_noconfintroconnectionrefuseddiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintroconnectionrefuseddiagpart2')
            case "INCORRECT_CREDENTIALS":
                errorDiag = translate(props.language, 'page_noconfintrodiag')
            case "ACCESS_DENIED":
                errorDiag = <span>{translate(props.language, 'page_noconfintroaccessdenieddiagpart1') + fetchedConfig.database + ".*" + translate(props.language, 'page_noconfintroaccessdenieddiagpart2') + "\"" + fetchedConfig.dbusername + "\"" + "@" + "\"" + fetchedConfig.hostname + "\""}</span>
            case "REDIS_CONNECTION_REFUSED":
                errorDiag = translate(props.language, 'page_noconfintroconnectionrefuseddiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintroconnectionrefuseddiagpart2')
            case "WRONGPASS":
                errorDiag = translate(props.language, 'page_noconfintrodiag')
            case "BAD_DATABASE":
                errorDiag = <span>{translate(props.language, "page_redisbaddatabasediagpart1") + translate(props.language, 'page_globalnext') + translate(props.language, 'page_redisbaddatabasediagpart2')} <code>conf.json</code> {translate(props.language, "page_redisbaddatabasediagpart3")} <code>redis.conf</code></span>
            default:
                errorDiag = <span>{translate(props.language, "page_confunknownerrordiag")} <a href={props.uniconf.discord}> {translate(props.language, 'global_discorderver')} </a> {translate(props.language, 'page_serverlostconnectiondiagpart3')}</span>
        }
    }
    return errorDiag
};

function ErrorMessage(props) {
    let error
    if (!props.err) {
        error = <p>{translate(props.language, 'page_noconfintropart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintropart2') + props.confPath + translate(props.language, 'page_noconfintropart3') + props.uniconf.projname + translate(props.language, 'page_noconfintropart4')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
    } else {
        switch (props.err) {
            case "MISSING_FIELDS":
                error = <p>{translate(props.language, 'page_noconfintromissingfieldspart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintromissingfieldspart2') + props.confPath + translate(props.language, 'page_noconfintromissingfieldspart3') + props.uniconf.projname + translate(props.language, 'page_noconfintromissingfieldspart4')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "TOKEN_INVALID":
                error = <p>{translate(props.language, 'page_noconfintrobadtokenpart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintrobadtokenpart2') + props.confPath + translate(props.language, 'page_noconfintrobadtokenpart3') + props.uniconf.projname + translate(props.language, 'page_noconfintrobadtokenpart4')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "CONNECTION_REFUSED":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroconnectionrefused')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "INCORRECT_CREDENTIALS":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "ACCESS_DENIED":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroaccessdenied')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "REDIS_CONNECTION_REFUSED":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroredisconnectionrefused')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "WRONGPASS":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            case "BAD_DATABASE":
                error = <p>{translate(props.language, 'page_redisbaddatabasepart1') + translate(props.language, 'page_redisbaddatabasepart2')} <code>redis.conf</code> {translate(props.language, 'page_redisbaddatabasepart3')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
            default:
                log.error(props.err, props.language)
                error = <p>{translate(props.language, 'page_noconfintrounknowndiscorderror1') + props.uniconf.projname + translate(props.language, 'page_noconfintrounknowndiscorderror2')}<br /><ErrorDiag err={props.err} language={props.language} uniconf={props.uniconf} /></p>
        };
    }
    return error
};
function Noconfintro(props) {
    return (
        <div>
            <title>{props.uniconf.projname + " - " + translate(props.language, 'page_configpagetitle')}</title>
            <div className="global-intro-section">
                <div className="container">
                    <h1>{translate(props.language, 'page_noconfintroheader')}</h1>
                </div>
            </div>
            <div className="container" style={{ paddingTop: 1.25 + "em" }}>
                <ErrorMessage err={props.confErr} language={props.language} uniconf={props.uniconf} />
                <input type='submit' id="NextButton" className='button' value={translate(props.language, 'page_globalnext')} title={translate(props.language, 'page_globalnext')} />
            </div>
            <p>{JSON.stringify(getConfig().confExists)}</p>
        </div>
    )
}

module.exports = Noconfintro