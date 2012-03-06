/**
 * Routes all API requests to particular functions.
 * This file would be referenced by the `app.js` file, as:
 *
 *      var app    = express.createServer();
 *      var routes = require('./router');
 *
 * And called:
 *
 *      routes.setup(app);
 */

var index = require('./routes/index');
var user = require('./routes/user');

module.exports.setup = function( app ) {
    app.get(   '/',            index.index );
    app.get(   '/user',        user.getAllUsers);  
    app.post(  '/user',        user.createUser);  
    app.get(   '/user/:email', user.getUser ); 
    app.delete('/user/:email', user.deleteUser);        
    app.put(   '/user/:email', user.updateUser );
};
