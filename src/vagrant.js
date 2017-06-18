var fs = require('fs');
var ncp = require('ncp').ncp;
var spawn = require('child_process').spawn;

function Vagrant(imageFolder) {
  this.imageFolder = imageFolder;
  this.machineFolder = null;
  this.childProcess = null;
}

Vagrant.prototype.up = function(callback) {
  var self = this;
  if (!this.machineFolder) {
    this.machineFolder = fs.mkdtempSync('/tmp/vm-');
  }

  ncp(this.imageFolder, this.machineFolder, (err) => {
    if (err) {
      return callback(err);
    }

    if (self.childProcess) {
      return callback(new Error('Vagrant command already running for machine ' + self.machineFolder));
    }

    self.childProcess = spawn('vagrant', ['up'], {cwd:self.machineFolder});

    self.childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    self.childProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    self.childProcess.on('exit', (code, signal) => {
      console.log('Child process ended');
      self.childProcess = null;
      return callback(null);
    });
  });
};

Vagrant.prototype.destroy = function(callback) {
  var self = this;
  if (!this.machineFolder) {
    return callback(new Error('Vagrant machine does not exist'));
  }

  if (this.childProcess) {
    return callback(new Error('Vagrant command already running for machine ' + this.machineFolder));
  }

  this.childProcess = spawn('vagrant', ['destroy', '-f'], {cwd:this.machineFolder});

  this.childProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  this.childProcess.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  this.childProcess.on('exit', (code, signal) => {
    self.childProcess = null;
    return callback(null);
  });
}

Vagrant.prototype.killChildProcess = function(callback) {
  var self = this;
  if (this.childProcess) {
    console.log('Remove listener child process');
    this.childProcess.removeAllListeners('exit');
    console.log('Removed listener');
    self.childProcess.on('exit', (code, signal) => {
      console.log('Child process exited');
      self.childProcess = null;
      return callback(null);
    });
    self.childProcess.kill();
  } else {
    return callback(null);
  }
}

module.exports = Vagrant;