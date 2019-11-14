'use strict';

var browserify = require('browserify')
  , path = require('path')
  , fs = require('fs');

require('http').createServer(function statical(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  switch (req.url) {
    case '/':
      req.url = '/index.html';
    break;

    case '/dist/requests.js':
      var compiler
        , stream;

      res.setHeader('Content-Type', 'text/javascript');

      compiler = browserify({ debug: true, standalone: 'Requests' });
      compiler.add(path.join(__dirname, '..', 'browser.js'));

      stream = compiler.bundle();

      stream.pipe(res);
      stream.pipe(fs.createWriteStream(path.join(__dirname, '..', req.url)));
    return;

    case '/stream':
      res.write('[first chunk]');
      setTimeout(function () {
        res.write('[second chunk]');

        setTimeout(function () {
          res.end('[final chunk]');
        }, 10000);
      }, 100);
    return;
  }

  if (!fs.existsSync(__dirname + req.url)) {
    res.write('<script src="/dist/requests.js"></script>');
    return res.end('Nope, doesn\'t exist.');
  }

  require('fs').createReadStream(__dirname + req.url).pipe(res);
}).on('connection', function connection(socket) {
  //
  // Force buffer flusing when we call our write.
  //
  socket.setNoDelay(true);
}).listen(+process.argv[2] || 8080, function listening() {
  console.log('Development server is now running on:');
  console.log('');
  console.log('  http://localhost:'+ this.address().port);
  console.log('');
});
