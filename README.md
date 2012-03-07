A simple wrapper for generating REST API documentation for [Express](http://expressjs.com/)-based
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
       api.generate('app.js', 'public/api.html');

The `api` variable has a single function, `generate()`, which
takes two parameters:

  * Input file specifies an `app` or `router` script (see below).
  * Output file where the HTML code should be placed.


Router File
-----------

Currently, the project reads a single file for all the routes. While most
projects use the `app.js` file, you could separate the routes into another file 
that the `app.js` file calls. Something like a `router.js` file:

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

Resource Entries
----------------

The documentation also reads [Express-Resource](https://github.com/visionmedia/express-resource)
entries. For instance:

    app.resource('user',     require('./resources/user'));
    app.resource('register', require('./resources/register'));
    app.resource('apps',     require('./resources/application'));
    app.resource('services', require('./resources/service'));

In this case, the files are read and the REST routes are determined based on
*the name of the function*:

  * `GET     /name`              ->  `index()`
  * `GET     /name/new`          ->  `new()`
  * `POST    /name`              ->  `create()`
  * `GET     /name/<ID>`       ->  `show()`
  * `GET     /name/<ID>/edit`  ->  `edit()`
  * `PUT     /name/<ID>`       ->  `update()`
  * `DELETE  /name/<ID>`       ->  `destroy()`


Release Notes
-------------

### v 0.0.4

Bug Fix: Variable names that require other files now can include underbar
characters.

### v 0.0.3

Work with both **Express** routes (e.g. `app.get`) as well as 
**Express Resource** projects (e.g. `app.resource`).

### v 0.0.2

Minor Update: Templates now use the **Handlebars** project.

### v 0.0.1

Initial project that can parse a given JavaScript file containing **Express**
routes, e.g. `app.get` and `app.post`, and infer the comments from the 
referenced files. 