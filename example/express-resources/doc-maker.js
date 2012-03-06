/**
 * A simple approach to calling the Express API Document Generator.
 * To do this yourself, the require would not reference the relative
 * path shown here, but instead would be:
 *
 *       var api = require('express-api-docs');
 */

var api = require('../../make-api-docs');

api.generate('app.js', 'public/api.html');