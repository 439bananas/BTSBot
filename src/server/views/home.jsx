/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: home.jsx                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')
const FeatureCard = require('./components/featureCard');
const translate = require('./components/getLanguageString');

function Home(props) {
    let oauth2link = "https://discord.com/oauth2/authorize?client_id=" + props.addToServerLink.clientid + "&permissions=" + props.uniconf.perms + "&redirect_uri=" + encodeURIComponent(props.addToServerLink.address + "/login") + "&response_type=code&scope=guilds%20email%20identify%20bot%20applications.commands"
    return (<div>
        <div className="global-intro-section">
            <div className="container">
                <h1>{translate(props.language, 'page_hometitle')}</h1>
                <p style={{ paddingTop: "calc(0.5rem + 0.5vw)" }}>
                    {translate(props.language, 'page_homeintropart1') + props.uniconf.projname + ". " + props.uniconf.projname + translate(props.language, 'page_homeintropart2')}
                </p>
                <p>
                    {translate(props.language, 'page_homeintropart3')}
                </p>
            </div>
        </div>
        <div className="home-feature-section">
            <div className="container">
                <h2 style={{ paddingTop: 0.25 + "em" }}>{translate(props.language, 'page_featuresheading')}</h2>
                <div className="row g-4 features">
                    <FeatureCard title={translate(props.language, 'page_feature1title')} id="modmail" emoji="speech-balloon">
                        {translate(props.language, 'page_feature1text')}
                    </FeatureCard>
                    <FeatureCard title={translate(props.language, 'page_feature2title')} id="restore" emoji="floppy-disk">
                        {translate(props.language, 'page_feature2text')}
                    </FeatureCard>
                    <FeatureCard title={translate(props.language, 'page_feature3title')} id="scam" emoji="hammer">
                        {translate(props.language, 'page_feature3text')}
                    </FeatureCard>
                </div>
                <div className="row g-4 features">
                    <FeatureCard title={translate(props.language, 'page_feature4title')} id="appeal" emoji="memo">
                        {translate(props.language, 'page_feature4text')}
                    </FeatureCard>
                    <FeatureCard title={translate(props.language, 'page_feature5title')} id="verify" emoji="office-building">
                        {translate(props.language, 'page_feature5text')}
                    </FeatureCard>
                    <FeatureCard title={translate(props.language, 'page_feature6title')} id="voice" emoji="telephone">
                        {translate(props.language, 'page_feature6text')}
                    </FeatureCard>
                </div>
                <p style={{ textAlign: "center" }}>
                    {translate(props.language, 'page_homeoutropart1')}
                    <br /><a href={oauth2link}>{translate(props.language, 'page_homeoutropart2') + props.uniconf.projname + translate(props.language, 'page_homeoutropart3')}</a>{translate(props.language, 'page_homeoutropart4')}
                </p>
            </div>
        </div>
    </div>
    )
}

module.exports = Home