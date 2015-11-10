# markov

무작위 텍스트의 생성을 위한 마르코프 체인
a fork of [node-markov](https://github.com/substack/node-markov)

## 예시 / Example
[markov-park](https://github.com/dolsup/markov-park).js:
```js
    var fs = require('fs'); 
    var markov = require('node-markov-kor');
    
    var m = markov();
    var s = fs.createReadStream(__dirname + '/corpus.txt');
    m.seed(s, function () {
            console.log( m.generateText() );
    });
```
출력:
```sh
    $ node markov-park.js
    나라로서 힘들게 살았고, 안보적으로 굉장히 정신적으로, 신체적으로 변화가 빠르게 바뀌고 있다. 태어나선 안될 나라로 서술돼 있다. 태어나선 안될 정부, 못난 역사로 아이들에게 가르치는데 이렇게 발전해 왔기 때문에 앞으로도 그렇게 국민이 대개 신고를 했듯이… 우리 국민들 모두가 정부부터 해가지고 안전을 보호하지도 못하는 것을 보면서, 국민들은 정부의 무능과 무책임에 분노하며, 국가에 대한 올바른 역사교육은 너무나 당연한 것이다.
```

## 메소드 / Methods
=======

markov(order)
-------------
order 차의 새 마르코프 객체를 생성한다. 기본값은 1차.


.seed(s, cb)
------------

문자열이나 스트림 s를 마르코프 객체의 시드값으로 쓴다.

If `s` is a string, transition probabilities will be updated for every grouping
of the previously specified order with dangling links at the front and end in
the appropriate direction.

If `s`s is a stream, data events will be line-buffered and fed into `.seed()` again
line-by-line.

If `cb` is specified it will fire once the seed text is fully ingested.

.search(text)
-------------

Search for and return some key found in the text body `text`.

Return `undefined` if no matches were found.

.pick()
-------

Choose a key at random.

.next(key)
----------

Find a key likely to follow after `key`.

Returns a hash with keys `key`, the canonical next key and `word`, a raw form of
`key` as it appeared in the seed text.

.prev(key)
----------

Find a key likely to come before `key`.

Returns a hash with keys `key`, the canonical next key and `word`, a raw form of
`key` as it appeared in the seed text.

.forward(key, limit)
--------------------

Generate a markov chain forward starting at `key` and returning an array of the
raw word forms along the way.

Stop when the traversal hits a terminal entry or when limit words have been
generated if limit is specified.

.backward(key, limit)
---------------------

Generate a markov chain backward starting at `key` and returning an array of the
raw word forms along the way.

Stop when the traversal hits a terminal entry or when limit words have been
generated if limit is specified.

.fill(key, limit)
-----------------

Generate a markov chain in both directions starting at `key`. Return an array of
the raw word forms along the way including the raw word form of the supplied
`key`.

Stop when the traversal hits a terminal entry or when limit words have been
generated if limit is specified.

.respond(text, limit)
---------------------

Search for a starting key in `text` and then call `.fill(key, limit)` on it.

.generateText(text, limit)
--------------------------

코퍼스를 바탕으로 텍스트를 생성한다. text는 지정할 시작 노드, limit는 연결할 노드의 최대 개수.
