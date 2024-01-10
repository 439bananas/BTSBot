/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: categories.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react');
const translate = require('./components/getLanguageString');

function Categories(props) {
    let cards = []
    console.log(props.cats)

    if (props.cats != null) {
        let key = 0
        for (cat of props.cats.items) {
            cards.push(<div className="col-sm-3 dashboard-category" key={key++}>
                <div className="card">
                    <div className="card-body">
                        <center>
                            <h3 className="card-title">{translate(props.language, cat.title)}</h3>
                            <div style={{margin: 2 + "vh"}}></div>
                            <i className={"twa twa-" + cat.emoji} style={{ fontSize: "calc(2vh + 3em)" }}></i>
                        </center>
                        <div style={{margin: 2 + "vh"}}></div>
                        <p className="card-text">
                            <center>
                                {translate(props.language, cat.description)}
                            </center>
                        </p>
                    </div>
                </div>
            </div>)
        }
    }
    
    console.log("abc")
    return (
        <div className="container">
            <div style={{ paddingTop: 1 + "em" }}></div>
            <div className="row">
                {cards}
            </div>
        </div>
    )
}

module.exports = Categories