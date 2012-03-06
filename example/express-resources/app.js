// Copyright (c) 2012. This file is confidential and proprietary.
// All Rights Reserved, Huawei Technologies (http://www.huawei.com)


/**
 * Module dependencies.
 */

var  express = require('express')
  , Resource = require('express-resource')
  ,   routes = require('./routes')
  ,   config = require("./config").values;

var app = module.exports = express.createServer();

/**
 * Configuration can come from the 'config.js' file
 * and from command line options. 
 * 
 * The --public option removes the 'localhost' reference
 * in the config file allowing remote hosts to connect.
 */

if (process.argv.indexOf('--public') > -1) {
	config.public = true;
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jqtpl');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

//Resources are REST-like paths defined in a code file:
app.resource('user', require('./resources/user'));
app.resource('env', require('./resources/env'));
app.resource('login', require('./resources/login'));
app.resource('register', require('./resources/register'));
app.resource('logout',require('./resources/logout'));
app.resource('apps',require('./resources/application'));
app.get('/', routes.index);

if (config.public) {
	app.listen(config.port);
}
else {
	app.listen(config.port, config.host);
}
if (app.port) {
    console.log("  Gateway server listening on port %d in %s mode",
        app.port, app.settings.env);
}
else {
    console.log("  Gateway server listening on port %d in %s mode",
        app.port, app.settings.env);
}
console.log("  Accessing 'cp-database' at- %s", config.database);
console.log("  Accessing 'cbc-controller' at- %s", config.cloudbase);
