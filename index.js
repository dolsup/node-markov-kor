var EventEmitter = require('events').EventEmitter;
var deck = require('deck');

module.exports = function (order) {
    if (!order) order = 2;
    var db = {};
    var self = {};
    
    self.seed = function (seed, cb) {
        if (seed instanceof EventEmitter) {
            Lazy(seed).lines.forEach(self.seed);
            
            if (cb) {
                seed.on('error', cb);
                seed.on('end', cb);
            }
        }
        else {
            var text = (Buffer.isBuffer(seed) ? seed.toString() : seed)
            var words = text.split(/\s+/);
            var links = [];
            for (var i = 0; i < words.length; i += order) {
                var link = words.slice(i, i + order).join(' ');
                links.push(link);
            }
            
            for (var i = 1; i < links.length; i++) {
                var word = links[i-1];
                var cword = clean(word);
                var next = links[i];
                var cnext = clean(next);
                
                if (!db[cword]) db[cword] = {};
                
                var node = db[cword][cnext] || {
                    count : 0,
                    words : {},
                    next : {},
                };
                db[cword][cnext] = node;
                
                node.count ++;
                node.words[word] = (node.words[word] || 0) + 1;
                node.next[next] = (node.next[next] || 0) + 1;
            }
            
            if (cb) cb(null);
        }
    };
    
    self.respond = function (text, limit) {
        var words = text.split(/\s+/);
        
        // find a starting point...
        var start = null;
        var words = {};
        for (var i = 0; i < words.length; i += order) {
            var word = clean(words.slice(i, i + 2).join(' '));
            if (db[word]) {
                start = deck.pick(Hash.map(db[word], function (node) {
                    return node.count;
                }));
            }
        }
        
        // nothing found, pick something random
        if (!start) start = deck.pick(Object.keys(words));
        
        console.dir({ start : start });
    };
    
    return self;
};

function clean (s) {
    return s.toLowerCase().replace(/[^a-z\d]+/g, '_');
}
