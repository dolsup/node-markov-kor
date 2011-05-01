var util = require('util');
var fs = require('fs');

var markov = require('markov');
var m = markov(2);

var s = fs.createReadStream(__dirname + '/qwantz.txt');
m.seed(s, function () {
    var stdin = process.openStdin();
    util.print('> ');
    
    stdin.on('data', function (line) {
        var res = m.respond(line.toString());
        console.log(res);
        util.print('> ');
    });
});
