// # Socket Plugin Module

const KEY = 'express.sid'
	, SECRET = 'express';
// Module dependencies

var express = require('express')
  , ghostPlugin = require('../../core/server/plugins/GhostPlugin')
  , app = express()
  , server = require('http').createServer(app)
  , cookie = express.cookieParser(SECRET)
  , store = new express.session.MemoryStore()
  , session = express.session({secret: SECRET
                             , key: KEY
                             , store: store})
  , io;

ghostPlugin.install = function (ghost) {
	var server = ghost.server;
	server.configure(function(){
	  server.use(cookie);
	  server.use(session);
	});
	io = require('socket.io').listen(server);
    return;
};

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