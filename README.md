# markov-kor

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
    그 배기 가스라든가 이러한 것에서 커다란 부담을 갖지 않도록 정부가 구조 수색과 조속한 사고 수습을 위해 많은 평가가 있기 때문에 이 두가지를 동시에 생각해야만 바른 평가가 있는 역량을 갖고 정치권, 정부 모두가 안전을 우리가 같이 지키자 하는 것은 자라나는 세대들에게 우리가 최선을 다하면 된다는 의미죠?
```

## node-markov에서 달라진 점
- 알파벳, 숫자 이외의 모든 문자를 걸러내지 않습니다.
- `next.word`를 `res`에 unshift가 아니라 push합니다. 버그였는진 모르겠지만 이게 결과가 좋습니다.
- 한 줄에 한 문장씩 코퍼스를 넣지 않았어도 문장 단위로 결과가 나옵니다.
- 끊겨서 나오지 않았으면 하는 것은 `_`로 이어 주면 출력 시에는 공백으로 치환되어 나옵니다.
- `generateText` 메소드가 추가되었습니다. 어절 배열이 아닌 문자열로 join되어 나옵니다.


## 메소드 / Methods

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

.generateText(text, limit)
--------------------------

코퍼스를 바탕으로 텍스트를 생성한다. `text`는 지정할 시작 노드, `limit`는 연결할 노드의 최대 개수.

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