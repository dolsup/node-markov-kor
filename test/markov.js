var assert = require('assert');
var markov = require('markov');

exports.order2 = function () {
    var m = markov(2);
    m.seed('This is a test.');
    assert.eql(m.respond('This is'), 'a test.');
};
