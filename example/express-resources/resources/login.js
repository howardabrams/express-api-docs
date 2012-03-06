/**
 * Get login user's information from database
 *
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */

exports.index = function( request, response ) {
    // user.findById( options );
};

/**
 * For user login, check user's email and password from CloudBase database.
 *
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */

exports.create = function( request, response ) {
    // user.authenticate( options );
}; // end exports.create

/**
 * Make sure that the following entry doesn't end up in our public API, since
 * it is not actually routable.
 */

exports.testInit = function(dependencies) {
    // user = dependencies.user;
};
