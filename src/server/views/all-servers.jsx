/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: all-servers.jsx                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import Error404 from "./404";
import translate from './components/getLanguageString.cjs';

function AllServers(props) {
    const [idInput, setIdInput] = useState("")
    if (props.userIsMod) {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                window.location.href = "/servers/" + idInput
            }
        };
        let newOption = <div className="container"><input type='text' value={idInput} placeholder={translate(props.language, "page_allserversplaceholdertext")} type="number" onChange={e => setIdInput(e.target.value)} className="allServersInput" onKeyDown={handleKeyDown}/></div>
            return newOption
        } else {
            return <Error404 language={props.language} confErr={props.confErr} uniconf={props.uniconf} />
        }
}

export default AllServers;