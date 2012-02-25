A simple wrapper for generating REST API documentation for Express-based
projects. This combines the parsing of [dox][1] with a [Handlebars][2]
template engine to produce HTML documentation describing a REST interface.

Keep in mind, the project makes some assumptions, so you probably want
to really just clone this project and change it.

Installation
------------

You can install by either running the following command:

    npm install express-api-docs

Or adding the appropriate line to your `package.json` file.

Using
-----

Create a JavaScript file, like `make-docs.sh` that contains the
following:

       var api = require('express-api-docs');
       api.generate('router.js', 'public/api.html');

The `api` variable has a single function, `generate()`, which
takes two parameters:

  * Input file specifies a `router` script (see below).
  * Output file where the HTML code should be placed.


Router File
-----------

Currently, the project assumes that your *routes* are not in your main
`app.js` file, but instead live is a separate file that the `app.js`
file calls. Something like:

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

The *parsing* code for analyzing the routes is currently very brittle
and will be the first piece to be retooled.