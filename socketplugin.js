// # Socket Plugin Module

// Module dependencies

var express = require('express')
  , socketplugin = require('../../core/server/plugins/GhostPlugin')
  , store = new express.session.MemoryStore()
  , cookie, session, io, GhostPlugin;

// ### Show Room
// 'myroom' handler.
function showRoom(req, res, next) {
    if (req.session.user) {
        res.render('teacherRoom');
    }else{
		res.render('studentRoom');
	}

    next();
}

GhostPlugin = function (ghost) {
    this.app = ghost;
};


GhostPlugin.prototype.activate = function (ghost) {

	var server = ghost.server;
	var httpserver = require('http').createServer(server);
	//cookie = express.cookieParser(ghost.dbHash);
	//session = express.cookieSession({store: store});

	//server.use(cookie);
	//server.use(session);

    //server.get('/myroom/roomId/', showRoom);
	io = require('socket.io').listen(httpserver);
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
GhostPlugin.prototype.install = function (ghost) {

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


