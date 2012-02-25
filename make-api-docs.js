/**
 * We can run this program to generate the HTML docs for the API.
 *
 * Algorithm includes:
 *   - Reading the router.js and getting the list of files and functions.
 */

var fs = require('fs');
var dox = require('dox');
var handlebars = require('handlebars');

var files = [];
var funcs = {};
var output = { entries: [] };

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
        inputFile  = "./router.js";
    }
    if (!outputFile) {
        outputFile = "public/api.html";
    }

    var data = fs.readFileSync (inputFile, 'utf8');
    parseRoutes(data);

    // console.log(files);
    // console.log(funcs);

    files.forEach( function(file) {
        analyzeFile(file);
    });
    
    writeFile(outputFile);
};

var writeFile = function(file) {
    var data = fs.readFileSync ( __dirname + '/template.html', 'utf8');
    var template = handlebars.compile(data);

    // console.log(output);

    fs.writeFileSync(file, template(output) );
};

var parseRoutes = function(data) {
    data.split(/\n+/).forEach( function(line) {
        var r = /^\s*var\s*([A-Za-z0-9]+)\s*=\s*require\s*\(['"]([^'"]+)['"]\);/.exec(line);
        if ( r ) {
            files.push({
                label: r[1],
                file: r[2]
            });
        }
        var a = /^\s*app\.([A-Za-z0-9]+)\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^.]+)\.([^\) ]+)/.exec(line);
        if ( a ) {
            funcs[ a[4] ] = {
                method: a[1],
                route : a[2],
                file  : a[3],
                func  : a[4]
            };
        }
    });
};

//
// Function called for each file mentioned in the `router.js` file.
//

var analyzeFile = function(file) {

    var filename = file.file;
    if ( ! /\.js$/.test(filename) ) {
        filename = filename + '.js';
    }
    var js = fs.readFileSync(filename, 'utf8');
    var d = dox.parseComments(js);
    d.forEach( function(entry) {
        if (entry.ctx && entry.ctx.type == 'method') {
            // console.log("Working on API docs for route: %s", entry.ctx.name);
            createRoute(entry.ctx.name, entry);
        }
    });
};


//
// Function called for each route referenced in the file, 
// 

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