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
            cards.push(
                <div className="category-card" key={key++}>
                    <div style={{margin: 1.25 + "ex", overflowWrap: "anywhere", display: "flex", alignItems: "center"}}>
                        <h3>{translate(props.language, cat.title)}</h3>
                    </div>
                    <div>
                    <center>
                        <i className={"twa twa-" + cat.emoji} style={{ fontSize: "calc(6ex + 2em)" }}></i>
                        </center>
                    </div>
                </div>)
        }
    }

    return (
        <div className="container">
            <div style={{ paddingTop: 1 + "em" }}></div>
            <div className="grid">
                {cards}
            </div>
        </div>
    )
}

module.exports = Categories