/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: home.jsx                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const ConfLayout = require('./components/conf-layout');
const translate = require('./components/getLanguageString');

<ConfLayout>
    <div className="global-intro-section">
        <div className="container">
            <h1>{translate(lang, 'page_hometitle')}</h1>
            <p style={{ paddingTop: "calc(0.5rem + 0.5vw)" }}>
                {translate(lang, 'page_homeintropart1') + uniconf.projname + ". " + uniconf.projname + translate(lang, 'page_homeintropart2')}
            </p>
            <p>
                {translate(lang, 'page_homeintropart3')}
            </p>
        </div>
    </div>
    <div className="home-feature-section">
        <div className="container">
            <h2 style={{ paddingTop: 0.25 + "em" }}>{translate(lang, 'page_featuresheading')}</h2>
            <div className="row g-4 features">
                <div className="col feature">
                    <h3 className="feature-title">{translate(lang, 'page_feature1title')}</h3>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#inviteImage"><i className="twa twa-inbox-tray home-emoji"></i></a>
                    <div className="modal fade" id="inviteImage" tabindex="-1" aria-labelledby="inviteImageLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src="/resources/invitedemo.png" className="img-fluid mw-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        {translate(lang, 'page_feature1text')}
                    </p>
                </div>
                <div className="col feature">
                    <h3 className="feature-title">{translate(lang, 'page_feature2title')}</h3>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#restoreImage"><i className="twa twa-floppy-disk home-emoji"></i></a>
                    <div className="modal fade" id="restoreImage" tabindex="-1" aria-labelledby="restoreImageLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src="/resources/restoredemo.png" className="img-fluid mw-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        {translate(lang, 'page_feature2text')}
                    </p>
                </div>
                <div className="col feature">
                    <h3 className="feature-title">{translate(lang, 'page_feature3title')}</h3>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#scamImage"><i className="twa twa-hammer home-emoji"></i></a>
                    <div className="modal fade" id="scamImage" tabindex="-1" aria-labelledby="scamImageLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src="/resources/scamdemo.png" className="img-fluid mw-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        {translate(lang, 'page_feature3text')}
                    </p>
                </div>
            </div>
            <div className="row g-4 features">
                <div className="col feature">
                    <h3 className="feature-title">{translate(lang, 'page_feature4title')}</h3>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#appealImage"><i className="twa twa-memo home-emoji"></i></a>
                    <div className="modal fade" id="appealImage" tabindex="-1" aria-labelledby="appealImageLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src="/resources/appealdemo.png" className="img-fluid mw-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        {translate(lang, 'page_feature4text')}
                    </p>
                </div>
                <div className="col feature">
                    <h3 className="feature-title">{translate(lang, 'page_feature5title')}</h3>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#verifyImage"><i className="twa twa-office-building home-emoji"></i></a>
                    <div className="modal fade" id="verifyImage" tabindex="-1" aria-labelledby="verifyImageLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src="/resources/verifydemo.png" className="img-fluid mw-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        {translate(lang, 'page_feature5text')}
                    </p>
                </div>
                <div className="col feature">
                    <h3 className="feature-title">{translate(lang, 'page_feature6title')}</h3>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#voiceImage"><i className="twa twa-telephone home-emoji"></i></a>
                    <div className="modal fade" id="voiceImage" tabindex="-1" aria-labelledby="voiceImageLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src="/resources/voicedemo.png" className="img-fluid mw-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        {translate(lang, 'page_feature6text')}
                    </p>
                </div>
            </div>
            <p style={{ textAlign: "center" }}>
                {translate(lang, 'page_homeoutropart1')}
                <br />{translate(lang, 'page_homeoutropart2')}<a href={oauth2link}>{translate(lang, 'page_homeoutropart3') + uniconf.projname + translate(lang, 'page_homeoutropart4')}</a>{translate(lang, 'page_homeoutropart5')}
            </p>
        </div>
    </div>
</ConfLayout>