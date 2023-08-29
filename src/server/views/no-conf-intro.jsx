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
            let rawResponse = await fetch("/api/conf")
            let response = await rawResponse.json()
            setConfInfo(response)
        }

        fetchConfInfo()
    })

    return confInfo
}

function ErrorDiag(props) {
    let errorDiag
    if (!props.err) {
        errorDiag = translate(props.language, 'page_noconfintrodiag')
    } else {
        switch (props.err) {
            case "MISSING_FIELDS":
                errorDiag = translate(props.language, 'page_noconfintrodiag')
                break
            case "TOKEN_INVALID":
                errorDiag = translate(props.language, 'page_noconfintrobadtokendiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintrobadtokendiagpart2')
                break
            case "CONNECTION_REFUSED":
                errorDiag = translate(props.language, 'page_noconfintroconnectionrefuseddiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintroconnectionrefuseddiagpart2')
                break
            case "INCORRECT_CREDENTIALS":
                errorDiag = translate(props.language, 'page_noconfintrodiag')
                break
            case "ACCESS_DENIED":
                errorDiag = <span>{translate(props.language, 'page_noconfintroaccessdenieddiagpart1') + JSON.stringify(getConfig().database) + ".*" + translate(props.language, 'page_noconfintroaccessdenieddiagpart2') + "\"" + JSON.stringify(getConfig().dbusername) + "\"" + "@" + "\"" + JSON.stringify(getConfig().hostname) + "\""}</span>
                break
            case "REDIS_CONNECTION_REFUSED":
                errorDiag = translate(props.language, 'page_noconfintroconnectionrefuseddiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintroconnectionrefuseddiagpart2')
                break
            case "WRONGPASS":
                errorDiag = translate(props.language, 'page_noconfintrodiag')
                break
            case "BAD_DATABASE":
                errorDiag = <span>{translate(props.language, "page_redisbaddatabasediagpart1") + translate(props.language, 'page_globalnext') + translate(props.language, 'page_redisbaddatabasediagpart2')} <code>conf.json</code> {translate(props.language, "page_redisbaddatabasediagpart3")} <code>redis.conf</code></span>
                break
            default:
                errorDiag = <span>{translate(props.language, "page_confunknownerrordiag")} <a href={props.uniconf.discord}> {translate(props.language, 'global_discorderver')} </a> {translate(props.language, 'page_serverlostconnectiondiagpart3')}</span>
                break
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
                break
            case "TOKEN_INVALID":
                error = <p>{translate(props.language, 'page_noconfintrobadtokenpart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintrobadtokenpart2') + props.confPath + translate(props.language, 'page_noconfintrobadtokenpart3') + props.uniconf.projname + translate(props.language, 'page_noconfintrobadtokenpart4')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            case "CONNECTION_REFUSED":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroconnectionrefused')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            case "INCORRECT_CREDENTIALS":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            case "ACCESS_DENIED":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroaccessdenied')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            case "REDIS_CONNECTION_REFUSED":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroredisconnectionrefused')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            case "WRONGPASS":
                error = <p>{props.uniconf.projname + translate(props.language, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            case "BAD_DATABASE":
                error = <p>{translate(props.language, 'page_redisbaddatabasepart1') + translate(props.language, 'page_redisbaddatabasepart2')} <code>redis.conf</code> {translate(props.language, 'page_redisbaddatabasepart3')}<br /><ErrorDiag err={props.err} language={props.language} /></p>
                break
            default:
                log.error(props.err, props.language)
                error = <p>{translate(props.language, 'page_noconfintrounknowndiscorderror1') + props.uniconf.projname + translate(props.language, 'page_noconfintrounknowndiscorderror2')}<br /><ErrorDiag err={props.err} language={props.language} uniconf={props.uniconf} /></p>
                break
        };
    }
    return error
};
function Noconfintro(props) {
    if (typeof (document) != "undefined") {
        document.title = props.uniconf.projname + " - " + translate(props.language, 'page_configpagetitle')
    }
    return (
        <div>
            <div className="global-intro-section">
                <div className="container">
                    <h1>{translate(props.language, 'page_noconfintroheader')}</h1>
                </div>
            </div>
            <div className="container" style={{ paddingTop: 1.25 + "em" }}>
                <ErrorMessage err={props.confErr} language={props.language} uniconf={props.uniconf} confPath={props.confPath} />
                <button type="button" id="NextButton" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
                    <div className="contents-18-Yxp">{translate(props.language, "page_globalnext")}</div>
                </button>
            </div>
        </div>
    )
}

module.exports = Noconfintro