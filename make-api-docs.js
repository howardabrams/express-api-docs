/**
 * We can run this program to generate the HTML docs for the API.
 *
 * Algorithm includes:
 *   - Reading the router.js and getting the list of files and functions.
 */

var fs = require('fs');
var dox = require('dox');

var files = [];
var funcs = {};
var output = "";
var out;

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

    out = fs.createWriteStream(outputFile);

    // We really need a template that we can use to create the HTML code,
    // but this will just have to do until then...
    out.write('<html><head>' +
              '<title>REST API Document</title>' +
              '<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css" type="text/css" rel="Stylesheet" />' +
              '<link rel="stylesheet" href="api-style.css" type="text/css"/>' +
              '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>' +
              '<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" type="text/javascript"></script>'+
              '<script type="text/javascript">'+
              '$(function() { \n' +
              '  $("#accordion").accordion({ header: "h1", collapsible: true, active: false, clearStyle: true }); \n'+
              '});' +
              '</script></head><body>' +
              '<div id="container">'+
              '  <div id="accordion">\n', 'utf8');

    fs.readFile ( inputFile, 'utf8', function(err, data) {

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

        // console.log(files);
        // console.log(funcs);

        files.forEach( function(file) {
            analyzeFile(file);
        });
    });
};


var closeFile = function() {
    // out.end('</div></div></body></html>');
};


//
// Function called for each file mentioned in the `router.js` file.
//

var analyzeFile = function(file) {

    var filename = file.file;
    if ( ! /\.js$/.test(filename) ) {
        filename = filename + '.js';
    }
    fs.readFile(filename, 'utf8', function(err, js) {
        if (err) {
            console.log(err);
        }
        else {
            var d = dox.parseComments(js);
            d.forEach( function(entry) {
                if (entry.ctx && entry.ctx.type == 'method') {
                    console.log("Working on %s", entry.ctx.name);
                    createRoute(entry.ctx.name, entry);
                }
            });

            closeFile();
        }
    });
};


//
// Function called for each route referenced in the file, 
// 

var createRoute = function(name, details) {

    var called = funcs[name];
    if (called) {
        // This concept of 'output' smells so bad, but I don't have a
        // template engine that I can use just yet.

        // console.log("Adding %s", name);
        out.write('<div><h1>'+
                  '<a href="#" name="'+name+'">' + 
                  called.method.toUpperCase()+' '+called.route+
                  '</a></h1>\n<div>' +
                  details.description.full +
                  '</div></div>');

        // console.log("FUNCTION: %s", name);
        // console.log("  Method: %s", called.method );
        // console.log("  Route: %s", called.route );
        // console.log(details);
    }
};