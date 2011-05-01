var assert = require('assert');
var markov = require('markov');
var fs = require('fs');

exports.cycles = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 5000);
    
    var m = markov(1);
    
    var these = 'the THE tHe ThE thE The';
    m.seed(these, function () {
        clearTimeout(to);
        
        var counts = {};
        for (var i = 0; i < 100; i++) {
            var res = m.respond('the', 100);
            assert.ok(res.length < 100);
            
            res.forEach(function (r) {
                assert.ok(these.split(' ').indexOf(r) >= 0);
                counts[r] = (counts[r] || 0) + 1;
            });
        }
        
        assert.eql(
            Object.keys(counts).sort(),
            these.split(' ').sort()
        );
    });
};
