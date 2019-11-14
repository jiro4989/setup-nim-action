'use strict';

var fs = require('fs')
  , url = require('url')
  , path = require('path')
  , http = require('http')
  , setHeader = require('setheader')
  , httpProxy = require('http-proxy');

module.exports = function staticserver(kill, next) {
  var proxy = httpProxy.createProxyServer({});

  var server = http.createServer(function serve(req, res) {
    var file = path.join(__dirname, url.parse(req.url).pathname);

    setHeader(res, 'Access-Control-Allow-Origin', req.headers.origin || '*');
    setHeader(res, 'Access-Control-Allow-Credentials', 'true');

    if (~req.url.indexOf('/204')) {
      res.statusCode = 204;
      return res.end('');
    }

    if (!fs.existsSync(file)) {
      req.headers.host = '';
      setHeader(res, 'Content-Security-Policy', 'removed');
      return proxy.web(req, res, { target: 'https://raw.githubusercontent.com' });
    }

    res.statusCode = 200;
    fs.createReadStream(file).pipe(res);
  });

  kill(function close(next) {
    server.close(next);
    proxy.close();
  });

  server.listen(8080, next);
};

//
// Static server loaded directly.
//
if (require.main === module) module.exports(function kill() {
}, function next(err) {
  if (err) throw err;

  console.log('static server listening on ', this.address());
});
