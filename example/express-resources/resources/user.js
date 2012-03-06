/**
 * Get all user information from database cloudportal and cloudbase
 * If fail to connect cloudportal or cloudbase, then throw the 400 error
 *
 * @param request  The HTTP request
 * @param response The object that we can send data. 
 *   If we 'send' JavaScript objects, they are automatically converted to JSON.
 */
exports.index = function(request, response) {
    // user.findAll(options);
};

/**
 * Creates a user account.
 *
 * @param request  - The HTTP request
 * @param response - The object that we can send data. 
 *                   Usually, we just return the the object created.
 */

exports.create = function(request, response) {
    // user.createUser(options);
};

/**
 * Returns to the name of this resource with the id
 * in a JSON object in the body of the request creates a new resource.
 *
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */

exports.show = function( request, response ) {
//    var queryId = user.queryId( request.params );
//    user.findById({
//        id : queryId,
//        success : function( user ) {
//            response.send(user,null);
//        },
//        error : function( error ) {
//            response.send(error, 400);
//        }
//    });
};

/**
 * Edits the `user` entry... I guess.
 * 
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */
exports.edit = function(request, response) {
    // response.send('edit team ' + request.params.team);
};

/**
 * Updates this resource with the id and the
 * updated properties of the resource is a JSON object in the body.
 * 
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */

exports.update = function(request, response) {
    // var queryId = user.queryId( request.params );
    // ... 
    // user.updateUser(options);
};

/**
 * Removes the resource with the id from the data base.
 *
 * @param request  - The standard HTTP request
 * @param response - The standard HTTP response that will contain the data.
 */

exports.destroy = function(request, response) {
    // var queryId = user.queryId( request.params );
    //    ...
    // user.destroyUser(options);
};

/**
 * Make sure that the following entry doesn't end up in our public API, since
 * it is not actually routable.
 */
exports.testInit = function(dependencies) {
    // user = dependencies.user;
};
