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

import React from 'react';
import { Link } from 'react-router-dom';
import translate from './components/getLanguageString.cjs';

function Categories(props) {
    let cards = []
    if (props.cats != null) {
        let key = 0
        for (cat of props.cats) { // Meow
            cards.push( // Create a new card for each listed category
                <Link to={props.id + "/" + cat.name} key={key++} className={"cat-link category-card"}>
                    <div style={{margin: 1.25 + "ex", overflowWrap: "anywhere", display: "flex", alignItems: "center"}}>
                        <h3>{translate(props.language, cat.title)}</h3>
                    </div>
                    <div>
                    <center>
                        <i className={"twa twa-" + cat.emoji} style={{ fontSize: "calc(6ex + 2em)" }}></i>
                        </center>
                    </div>
                </Link>)
        }
    }

    return ( // Return the lot
        <div className="container">
            <div style={{ paddingTop: 1 + "em" }}></div>
            <div className="grid">
                {cards}
            </div>
        </div>
    )
}

export default Categories