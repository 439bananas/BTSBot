/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: layout.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import Header from './header';
import Head from './head';

<html lang={lang}>
    <Head />
    <body>
        <Header />
        <main>
            {children}
        </main>
    </body>
</html>