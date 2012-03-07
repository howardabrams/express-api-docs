/**
 * We can run this program to generate the HTML docs for the API.
 *
 * Algorithm includes:
 *   - Reading the router.js and getting the list of files and functions.
 */

var fs = require('fs');
var dox = require('dox');
var handlebars = require('handlebars');

var files     = [];
var resources = [];
var funcs     = {};

// TODO: Remove this global variable and pass the values around...
var output    = { entries: [] };

/**
 * Reads a file containing Express routes. This function/behavior is
 * the most brittle part of this process, so while many people put the
 * routes in the main `app.js`, if you can create another `routes.js`
 * file that looks like:
 *
 *     var index = require('./routes/index');
 *     var user = require('./routes/user');
 *     
 *     module.exports.setup = function( app ) {
 *         app.get(   '/',            index.index );
 *         app.get(   '/user',        user.getAllUsers);  
 *         app.post(  '/user',        user.createUser);  
 *         app.get(   '/user/:email', user.getUser ); 
 *         app.delete('/user/:email', user.deleteUser);        
 *         app.put(   '/user/:email', user.updateUser );
 *     };
 * 
 * @param {String} The name of the JavaScript source code to read. If
 * not file is given, defaults to `./router.js`
 */

exports.generate = function(inputFile, outputFile) {
    if (!inputFile) {
        inputFile  = "./app.js";
    }
    if (!outputFile) {
        outputFile = "public/api.html";
    }

    var data = fs.readFileSync (inputFile, 'utf8');
    parseRoutes(data);

    // if (files.length > 0) {
    //     console.log(files);
    // }
    // if (resources.length > 0) {
    //     console.log(resources);
    // }
    // console.log(funcs);

    files.forEach( function(file) {
        analyzeFile(file);
    });
    
    resources.forEach( function(resource) {
        analyzeResource(resource);
    });

    writeFile(outputFile);
};

/**
 * Combines a *template* with the model (stored in `output`) and writes
 * out to a given file.
 * 
 * @param file {String} the name of the output file
 */
var writeFile = function(file) {
    var data = fs.readFileSync ( __dirname + '/template.html', 'utf8');
    var template = handlebars.compile(data);

    // console.log(output);
    fs.writeFileSync(file, template(output) );
};

/**
 * Walks through a top-level source code, line-by-line, and attempts
 * to *parse* the file by using a collection of regular expressions to
 * match particular 'patterns' that express and express-resource specifies.
 */

var parseRoutes = function(data) {
    data.split(/\n+/).forEach( function(line) {
        var r = /^\s*var\s*([A-Za-z0-9_]+)\s*=\s*require\s*\(['"]([^'"]+)['"]\s*\)\s*;/.exec(line);
        if ( r ) {
            files.push({
                label: r[1],
                file: r[2]
            });
        }
        var a = /^\s*app\.([A-Za-z0-9]+)\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^.]+)\.([^\) ]+)/.exec(line);
        if ( a && a[1] !== 'resource' ) {
            funcs[ a[4] ] = {
                method: a[1],
                route : a[2],
                file  : a[3],
                func  : a[4]
            };
        }
        
        // Express resource lines look like:
        //   app.resource('user', require('./resources/user'));
        var rsc = /^\s*app\.resource\s*\(\s*['"]([^'"]+)['"]\s*,\s*require\s*\(['"]([^'"]+)['"]\s*\)\s*\)\s*;/.exec(line);
        if ( rsc ) {
            resources.push({
                rsc : rsc[1],
                file: rsc[2]
            });
        }

    });
};

/**
 * Called for each file listed in the 'files' array. This will analyze and
 * parse the files functions and comments.
 *
 * @param file (String) The name of the file, with or without the final '.js'
 */
var analyzeFile = function(file) {

    var filename = file.file;
    if ( ! /\.js$/.test(filename) ) {
        filename = filename + '.js';
    }
    var js = fs.readFileSync(filename, 'utf8');
    var d = dox.parseComments(js);
    d.forEach( function(entry) {
        if (   entry.ctx && 
             ( entry.ctx.type == 'method' || entry.ctx.type == 'function') ) {
            // console.log("Working on API docs for route: %s", entry.ctx.name);
            createRoute(entry.ctx.name, entry);
        }
    });
};



/**
 * Function called for each route referenced in the file.
 * 
 * For each route referenced, we build up part of the "model" that will be
 * passed to the template engine for display.
 * 
 * **Note:** Doesn't return anything, but side effects include modifying the
 * `output` object model.
 * 
 * @param {String} name route name that should be part of `funcs[]` array
 * @param {Object} details acquired by `dox.parse`. Expects a `description` property.
 */ 

var createRoute = function(name, details) {

    var called = funcs[name];
    if (called) {
        output.entries.push({
            "name": name,
            "method": called.method.toUpperCase(),
            "route": called.route,
            "text": details.description.full
        });

        // console.log("FUNCTION: %s", name);
        // console.log("  Method: %s", called.method );
        // console.log("  Route: %s", called.route );
        // console.log(details);
    }
};

/**
 * Called for each file listed in the 'resource' array. This will analyze and
 * parse the files functions and comments.
 *
 * @param resource (String) The name of the file, with or without the final '.js'
 */
var analyzeResource = function(resource) {

    var label    = resource.rsc;
    var filename = resource.file;
    if ( ! /\.js$/.test(filename) ) {
        filename = filename + '.js';
    }
    
    try {
        var js = fs.readFileSync(filename, 'utf8');
        var d = dox.parseComments(js);
        
        d.forEach( function(entry) {
            if (   entry.ctx && 
                    ( entry.ctx.type == 'method' || entry.ctx.type == 'function') ) {
                console.log("Working on API docs for resource: %s", entry.ctx.name);
                var model = createResource(label, entry);
                if (model) {
                    output.entries.push( model );
                }
            }
        });
    }
    catch (err) {
        console.warn( err );
    }
};

/**
 * Function called for each resource referenced in the file.
 * 
 * For each resource referenced, we build up part of the "model" that will be
 * passed to the template engine for display. Of course, with `express-resource`
 * the names of the function *imply* a particular route, as in:
 * 
 *  - GET     /label          ->  index
 *  - GET     /label/new      ->  new
 *  - POST    /label          ->  create
 *  - GET     /label/ID       ->  show
 *  - GET     /label/ID/edit  ->  edit
 *  - PUT     /label/ID       ->  update
 *  - DELETE  /label/ID       ->  destroy
 * 
 * Where `label` is the name of the resource that is passed in, and `ID` is
 * an identification of the resource.
 * 
 * @param {String} label resource name that should be part of route
 * @param {Object} entry acquired by `dox.parse`. Expects a `description` property.
 * @returns {Object} a model entry that can be pushed into the `output`
 */ 

var createResource = function(label, entry) {
    var name   = entry.ctx.name;
    var method = 'GET';
    var route  = '/' + label;
    
    switch(entry.ctx.name) {
        case 'index':
            method = 'GET';
            route  = '/' + label;
            break;
        case 'new':
            method = 'GET';
            route  = '/' + label + '/new';
            break;
        case 'create':
            method = 'POST';
            route  = '/' + label;
            break;
        case 'show':
            method = 'GET';
            route  = '/' + label + '/&lt;ID&gt;';
            break;
        case 'edit':
            method = 'GET';
            route  = '/' + label + '/&lt;ID&gt;/edit';
            break;
        case 'update':
            method = 'PUT';
            route  = '/' + label + '/&lt;ID&gt;';
            break;
        case 'destroy':
            method = 'DELETE';
            route  = '/' + label + '/&lt;ID&gt;';
            break;
        default:
            return;
    }
    
    return {
        "name":   name,
        "method": method,
        "route":  route,
        "text":   entry.description.full
    };
};