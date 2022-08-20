(function (console_) {
  var BATCH_SIZE = 20;
  var FREQUENCY_MS = 250;

  function send(data) {
    const req = new XMLHttpRequest();
    req.open('POST', `http://${host}:2022/batch`);
    req.setRequestHeader('Content-type', 'text/plain');
    req.send(JSON.stringify(data));
  }

  function attachLogger(console) {
    var batchSize = BATCH_SIZE;
    var logs = [{ type: 'connect' }];
    var console_ = {};
    var keys = Object.keys(console);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      console_[key] = console[key];
      console[key] = function (...args) {
        var key_ = key;
        logs.push({ type: key_, args: args });
      };
    }
    setInterval(function () {
      const end = logs.length > batchSize ? batchSize : logs.length;
      if (end) {
        var logsToSend = logs.splice(0, end);
        send(logsToSend);
      }
    }, FREQUENCY_MS);
  }
  attachLogger(console_);
})(console);
