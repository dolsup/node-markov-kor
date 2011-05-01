var assert = require('assert');
var markov = require('markov');

exports.order1 = function () {
    var m = markov(1);
    m.seed('This is a test.');
    assert.eql(
        m.next('is'),
        { word : 'a', key : 'a' }
    );
    assert.eql(
        m.prev('is'),
        { word : 'This', key : 'this' }
    );
};

exports.order2 = function () {
    var m = markov(2);
    m.seed('This is a test.');
    assert.eql(
        m.next('this_is'),
        { word : 'a test.', key : 'a_test' }
    );
    assert.eql(
        m.prev('a_test'),
        { word : 'This is', key : 'this_is' }
    );
};
