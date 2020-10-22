var chai            = require('chai')
var should          = chai.should()
var chaiAsPromised  = require('chai-as-promised')
var BluebirdPromise = require('bluebird')
var requireNew      = require('require-new')
var spawn           = require('../index.js')

chai.use(chaiAsPromised)

describe('spawn-please', function() {

  it('resolve on success', function () {
    return spawn('true')
  })

  it('reject on fail', function () {
    return spawn('false')
      .catch(function (err) {
        should.exist(err)
      })
  })

  it('allow errors to be ignored with rejectOnError:false', function () {
    return spawn('false', [], { rejectOnError: false })
  })

  it('handle command-line arguments', function () {
    return spawn('printf', ['hello'])
      .then(function (output) {
        output.should.equal('hello')
      })
  })

  it('accept stdin', function () {
    return spawn('cat', [], 'test')
      .then(function (output) {
        output.should.equal('test')
      })
  })

  it('allow you to specify a custom Promise', function () {
    var spawn = requireNew('../index.js')
    spawn('true').should.not.be.an.instanceof(BluebirdPromise)
    spawn.Promise = BluebirdPromise
    spawn('true').should.be.an.instanceof(BluebirdPromise)
  })

  it('accept options as second argument', function () {
    return Promise.all([
      spawn('pwd', [], 'test', { cwd: __dirname})
        .then(function (output) {
          output.trim().should.equal(__dirname)
        }),
      // stdin should still be read
      spawn('cat', [], 'test', { cwd: __dirname})
        .then(function (output) {
          output.should.equal('test')
        })
    ])
  })

  it('accept options as third argument', function () {
    return spawn('pwd', [], { cwd: __dirname})
      .then(function (output) {
        output.trim().should.equal(__dirname)
      })
  })

  it('expose stdout and stderr', function () {
    let stdoutOutput = ''
    let stderrOutput = ''
    return spawn('node', ['./stdout-and-stderr.js'], {
      cwd: __dirname,
      stderr: function (data) { stderrOutput += data },
      stdout: function (data) { stdoutOutput += data },
    })
      .then(function () {
        stderrOutput.trim().should.equal('STDERR')
        stdoutOutput.trim().should.equal('STDOUT')
      })
  })

})
