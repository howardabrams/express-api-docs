/**
 * For register registration, store register's whole information to database.
 *
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */

exports.create = function( request, response ) {
    // user.authRegisterInfo( options );
};

/**
 * Make sure that the following entry doesn't end up in our public API, since
 * it is not actually routable.
 */

exports.testInit = function( dependencies ) {
	user = dependencies.user;
};
