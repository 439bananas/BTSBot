/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: error-page.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');

<Layout>
    <div className="container">
        <div className="alert-box danger text-wrap">
            {error}
            <br />
            {diag}
        </div>
    </div>
</Layout>