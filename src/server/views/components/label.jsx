/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: label.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')

function Label(props) {
    let required
    if (props.required) {
        required = "required "
    } else {
        required = ""
    }
    return <label htmlFor={props.for} className={required + "label-fppI2a marginBottom8-1wldKw small-29zrCQ size12-DS9Pyp height16-3r2Q2W primary300-qtIOwv weightSemiBold-tctXJ7 uppercase-1K74Lz"}>{props.children}</label>
}

module.exports = Label