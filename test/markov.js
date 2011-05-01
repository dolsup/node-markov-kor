var assert = require('assert');
var markov = require('markov');

exports.order2 = function () {
    var m = markov(2);
    m.seed('This is a test.');
    var key = m.search('This is');
    assert.eql(
        m.next(key),
        { word : 'a test.', key : 'a_test' }
    );
    assert.eql(
        m.prev('a_test'),
        { word : 'This is', key : 'this_is' }
    );
};
