/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: dashboard.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { BrowserRouter as Router, Route } from 'react-dom';
const ConfLayout = require('./components/conf-layout');

function Test() {
    return (<b>test</b>)
};

<Router>
<ConfLayout>
    <div className="global-intro-section">
        <div className="container">
            <center><h1>{guild.name}</h1></center>
        </div>
        </div>
        <Route path='test' component={Test} />
    </ConfLayout>
</Router>