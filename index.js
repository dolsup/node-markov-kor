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
                
                var node = db[cword] || {
                    count : 0,
                    words : {},
                    next : {},
                };
                db[cword] = node;
                
                node.count ++;
                node.words[word] = (node.words[word] || 0) + 1;
                node.next[cnext] = (node.next[cnext] || 0) + 1;
            }
            
            if (!db[cnext]) db[cnext] = {
                count : 0,
                words : {},
                next : {},
            };
            db[cnext].words[next] = (db[cnext].words[next] || 0) + 1;
            
            if (cb) cb(null);
        }
    };
    
    self.respond = function (text, limit) {
        if (!limit) limit = 100;
        var words = text.split(/\s+/);
        
        // find a starting point...
        var start = null;
        var groups = {};
        for (var i = 0; i < words.length; i += order) {
            var word = clean(words.slice(i, i + 2).join(' '));
            if (db[word]) groups[word] = db[word].count;
        }
        
        var cur = Object.keys(groups).length > 0
            ? deck.pick(groups)
            : deck.pick(Object.keys(db))
        ;
        
        var res = [];
        
        for (var i = 0; i < limit; i++) {
            cur = deck.pick(db[cur].next);
            if (!cur) break;
            res.push(deck.pick(db[cur].words));
        }
        
        return res;
    };
    
    return self;
};

function clean (s) {
    return s
        .toLowerCase()
        .replace(/[^a-z\d]+/g, '_')
        .replace(/^_/, '')
        .replace(/_$/, '')
    ;
}
