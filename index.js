var EventEmitter = require('events').EventEmitter;
var deck = require('deck');
var Lazy = require('lazy');

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
                    prev : {},
                };
                db[cword] = node;
                
                node.count ++;
                node.words[word] = (node.words[word] || 0) + 1;
                node.next[cnext] = (node.next[cnext] || 0) + 1;
                if (i > 1) {
                    var prev = clean(links[i-2]);
                    node.prev[prev] = (node.prev[prev] || 0) + 1;
                }
            }
            
            if (!db[cnext]) db[cnext] = {
                count : 0,
                words : {},
                next : {},
                prev : {},
            };
            db[cnext].words[next] = (db[cnext].words[next] || 0) + 1;
            db[cnext].prev[cword] = (db[cnext].prev[cword] || 0) + 1;
            
            if (cb) cb(null);
        }
    };
    
    self.search = function (text) {
        var words = text.split(/\s+/);
        
        // find a starting point...
        var start = null;
        var groups = {};
        for (var i = 0; i < words.length; i += order) {
            var word = clean(words.slice(i, i + order).join(' '));
            if (db[word]) groups[word] = db[word].count;
        }
        
        return deck.pick(groups);
        ;
    };
    
    self.pick = function () {
        return deck.pick(Object.keys(db))
    };
    
    self.next = function (cur) {
        var next = deck.pick(db[cur].next);
        return next && {
            key : next,
            word : deck.pick(db[next].words),
        } || undefined;
    };
    
    self.prev = function (cur) {
        var prev = deck.pick(db[cur].prev);
        return prev && {
            key : prev,
            word : deck.pick(db[prev].words),
        } || undefined;
    };
    
    self.forward = function (cur, limit) {
        var res = [];
        do {
            var next = self.next(cur);
            if (next) {
                cur = next.key;
                res.push(next.word);
            }
        } while (next && limit === 0 || res.length < limit)
        
        return res;
    };
    
    self.backward = function (cur, limit) {
        var res = [];
        do {
            var prev = self.prev(cur);
            if (prev) {
                cur = prev.key;
                res.unshift(prev.word);
            }
        } while (prev && limit === 0 || res.length < limit)
        
        return res;
    };
    
    self.fill = function (cur, limit) {
        var f = self.forward(cur, limit);
        var b = self.backward(cur, limit - f.length);
        return b.concat(f);
    };
    
    self.respond = function (text, limit) {
        var cur = self.search(text) || self.pick();
        return self.fill(cur, limit);
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
