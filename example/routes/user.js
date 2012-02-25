/**!
 * Collection of functions for dealing with user accounts.
 */

/**
 * Retrieves user information with a reference to either the user's
 * email address or ID value. If the parameter has a `@` in it, it is
 * treated as an email, otherwise, it assumes an ID value.
 * 
 * Examples:
 *
 *    GET /user/bob@dog.com
 *    GET /user/23857202328382
 *
 * Response:
 * 
 * Returns the data associated with a user as an object, as in:
 *
 *     {
 *       _id: 23857202328382,
 *       name: 'Bob Dog',
 *       email: 'bob@dog.com'
 *     }
 * 
 * Errors:
 *
 *  - `404` if the user account could not be found.
 *  - `500` with a database error
 *
 * Error Response:
 *
 *  With an status code of 300 or higher, the payload of the response will 
 *  contain a JSON document describing the error or problem, as in:
 *
 *     {
 *       'status' : 'error',
 *       'message': 'User account could not be found.',
 *       'value'  : 'cat@dog.com'
 *     }
 *
 * @param The standard HTTP request object 
 * @param The standard HTTP response object
 */

exports.getUser = function(request, response) {
    var query = setQuery(request.params.email);
    // database.find(collection, query, request.query, function(err, items) {
    //     // ...
    // });
};


/**
 * Creates a user account via a `POST` call. 
 * If the status code is not given, 200 is assumed.
 * 
 * Body:
 *
 * The body of the `POST` call should contain a user's account as a JSON
 * document, as in:
 *
 *     {
 *       'name'  : 'Bob Dog',
 *       'email' : 'bob@dog.com',
 *       'phone' : '534-284-7988'
 *     }
 *
 * Response:
 * 
 *  Returns the added user's information with an additional `id`
 *  value.
 * 
 * Errors:
 *
 *  - `400` if any of the data was invalid.
 *  - `500` with a database error
 *
 * Error Response:
 *
 *  With an status code of 300 or higher, the payload of the response will 
 *  contain a JSON document describing the error or problem, as in:
 *
 *     {
 *       'status' : 'error',
 *       'message': 'The email address was incorrectly formatted.',
 *       'field'  : 'email',
 *       'value'  : 'bob at dog dot com'
 *     }
 *
 * @param request The standard http request
 * @param response The standard http response
 */

exports.createUser = function(request, response) {
    // database.insert(collection, request.body, function(err, objects) {
    //      ....
    // });
};

/**
 * Returns an array of all users stored in our database. The information
 * is limited, but includes both the `id` and the `email` address, each
 * of which, can be used when calling the `GET` method to get more
 * information about a particular user.
 * 
 * Response:
 *
 *   The response will be a JSON array of objects. Each object will 
 *   contain an individual user account, for example:
 * 
 *     [
 *       {
 *         'id': 85757384532,
 *         'email': 'bob@dog.com'
 *       },
 *       {
 *         'id': 85757384533,
 *         'email': 'foo@bar.com'
 *       },
 *       {
 *         'id': 85757384534,
 *         'email': 'what@it-is.com'
 *       }
 *     ]
 * 
 * Errors:
 *
 *   - `500` if a database error happened
 *
 * @param request The standard http request
 * @param response The standard http response
 */

exports.getAllUsers = function(request, response) {
    // database.find(collection, {}, request.query,  function(err, objects) {
    //     ...
    // });
};

/**
 * Deletes a user's information. Similar to the `GET` request, either
 * the user's email address or ID value must be specified.
 *
 * Examples:
 *
 *    DELETE /user/bob@dog.com
 *    DELETE /user/23857202328382
 *
 * Response:
 * 
 *  Returns the user information associated with the user that was
 *  successfully deleted.
 *
 * Errors:
 *
 *  - `404` if the user account could not be found.
 *  - `500` with a database error
 *
 * @param request The standard http request
 * @param response The standard http response
 */

exports.deleteUser = function(request, response) {
    var query = setQuery(request.params.email);
    // database.delete(collection, query, function(err, items) {
    //     ...
    // });
};

/**
 * Updates a user's account information. Similar to the `GET` request,
 * the user is referenced by an email address or ID value. If the
 * parameter has a '@' in it, it is treated as an email, otherwise, it looks
 * for an id.
 * 
 * Examples:
 *
 *    PUT /user/bob@dog.com
 *    PUT /user/23857202328382
 *
 * Body:
 *
 * The body of the `PUT` should contain updated values for the user's
 * account as a JSON document, as in:
 *
 *     {
 *       'name'  : 'Bob Dog',
 *       'email' : 'bob@dog.com',
 *       'phone' : '534-284-7988'
 *     }
 *
 * Notice that all the information must be given, not just updated
 * values.
 * 
 * Response:
 * 
 * Returns the added user's information with an additional `id` value.
 * 
 * Errors:
 *
 *  - `400` if any of the data was invalid.
 *  - `400` if an `id` value was included in the body payload.
 *  - `500` with a database error.
 *
 * Error Response:
 *
 *  With an status code of 300 or higher, the payload of the response will 
 *  contain a JSON document describing the error or problem, as in:
 *
 *     {
 *       'status' : 'error',
 *       'message': 'The email address was incorrectly formatted.',
 *       'field'  : 'email',
 *       'value'  : 'bob at dog dot com'
 *     }
 * 
 * @param request The standard http request
 * @param response The standard http response
 */

exports.updateUser = function(request, response) {
    var query = setQuery( request.params.email );
    // database.update( collection, query, request.body, function( err, objects ) {
    //     ...
    // });
};
