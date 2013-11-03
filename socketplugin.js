// # Socket Plugin Module

const KEY = 'express.sid'
	, SECRET = 'express';
// Module dependencies

var express = require('express')
  , socketplugin = require('../../core/server/plugins/GhostPlugin')
  , app = express()
  , server = require('http').createServer(app)
  , cookie = express.cookieParser(SECRET)
  , store = new express.session.MemoryStore()
  , session = express.session({secret: SECRET
                             , key: KEY
                             , store: store})
  , io;

var GhostPlugin;

/**
 * GhostPlugin is the base class for a standard plugin.
 * @class
 * @parameter {Ghost} The current Ghost app instance
 */
GhostPlugin = function (ghost) {
    this.app = ghost;
};

/** 
 * A method that will be called on installation.
 * Can optionally return a promise if async.
 * @parameter {Ghost} The current Ghost app instance
 */
GhostPlugin.prototype.install = function (ghost) {
   	var server = ghost.server;

	  server.use(cookie);
	  server.use(session);

	io = require('socket.io').listen(server);
	io.set('authorization', function(data, accept) {
  cookie(data, {}, function(err) {
    if (!err) {
      var sessionID = data.signedCookies[KEY];
      store.get(sessionID, function(err, session) {
        if (err || !session) {
          accept(null, false);
        } else {
          data.session = session;
          accept(null, true);
        }
      });
    } else {
      accept(null, false);
    }
  });
});

io.sockets.on('connection', function (client) {
  var session = client.handshake.session
    , nome = session.nome;
//nome = 'Test';
  client.on('toServer', function (msg) {
    msg = "<b>"+nome+":</b> "+msg+"<br>";
    client.emit('toClient', msg);
    client.broadcast.emit('toClient', msg);
  });
});
    return;
};

/** 
 * A method that will be called on uninstallation.
 * Can optionally return a promise if async.
 * @parameter {Ghost} The current Ghost app instance
 */
GhostPlugin.prototype.uninstall = function (ghost) {
    return;
};

/** 
 * A method that will be called when the plugin is enabled.
 * Can optionally return a promise if async.
 * @parameter {Ghost} The current Ghost app instance
 */
GhostPlugin.prototype.activate = function (ghost) {
    return;
};

/** 
 * A method that will be called when the plugin is disabled.
 * Can optionally return a promise if async.
 * @parameter {Ghost} The current Ghost app instance
 */
GhostPlugin.prototype.deactivate = function (ghost) {
    return;
};

module.exports = GhostPlugin;


