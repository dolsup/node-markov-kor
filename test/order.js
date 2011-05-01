var assert = require('assert');
var markov = require('markov');

exports.order1 = function () {
    var m = markov(1);
    m.seed('This is a test.');
    
    assert.eql(
        m.search('What IS your problem?'),
        'is'
    );
    
    assert.ok(m.search('foo bar baz zing') === undefined);
    
    assert.ok('this is a test'.split(' ').indexOf(m.pick()) >= 0);
    
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
