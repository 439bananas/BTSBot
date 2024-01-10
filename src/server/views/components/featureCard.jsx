/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                      File: card.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')

function FeatureCard(props) {
    return <div className="col feature">
        <h3 className="feature-title">{props.title}</h3>
        <a href="#" data-bs-toggle="modal" data-bs-target={"#" + props.id + "Image"}><i className={"twa twa-" + props.emoji + " home-emoji"}></i></a>
        <div className="modal fade" id={props.id + "Image"} tabIndex="-1" aria-labelledby={props.id + "ImageLabel"} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <img src={"/resources/" + props.id + "demo.png"} className="img-fluid mw-100" />
                    </div>
                </div>
            </div>
        </div>
        <p>
            {props.children}
        </p>
    </div>
}

module.exports = FeatureCard