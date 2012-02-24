// Copyright (c) 2012. This file is confidential and proprietary.
// All Rights Reserved, Huawei Technologies (http://www.huawei.com)

// Module: index.js
//
//  The default router module. It contains a single
//  route, <index>, that answers / requests.

(function() {

    /*
     * Function: index
     *
     *  GET / - Redirects to the index.html page to run the tests.
     *
     *  This function simply returns a 302 HTTP status and redirects
     *  to the test-api/index.html file to quickly start up the tests.
     */
    
    module.exports.index = function(request, response) {
	response.statusCode = 302;
	response.setHeader("Location", "/index.html");
	response.end('<p>302. Redirecting to index.html</p>');
    };
    
}());
