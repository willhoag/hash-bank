# hash-bank
simple storage for creating and managing object hashes

[![Build Status](https://travis-ci.org/willhoag/hash-bank.svg?branch=master)](https://travis-ci.org/willhoag/hash-bank)
[![npm version](https://badge.fury.io/js/hash-bank.svg)](http://badge.fury.io/js/hash-bank)

If you use any of my packages, please star them on github. It’s a great way of getting feedback and gives me the kick to put more time into their development. If you encounter any bugs or have feature requests, just open an issue report on Github.

Follow me on Twitter [@devhoag](http://twitter.com/devhoag)

## Description
A flexible in memory store for creating and housing object hashes with expirability.


## Example
```js
import HashBank from 'hash-bank'

const b = HashBank({
  serialize: (obj) => obj.password + obj.id,
  defaultMeta: { expire: 60 * 1000 },
  interval: 2000
}).start()

const obj = {
  id: 'bob',
  password: 'xxxx-xxxx'
}

const objMeta = {
  expire: 1000,
  otherMeta: 'likes cats'
}

const hash = b.add(obj, objMeta)
b.exists(obj) // true
b.getMeta(obj)
// {
//   expire: 1000,
//   otherMeta: 'likes cats'
// }

sleep(2000)

b.hashExists(hash) // false

```

## Usage
### instantiate queue
```js
const b = HashBank(options)
```

### options
- `serialize:fn (default: identity)` - The transform called on `add` before
  converting and storing the hash.
- `defaultMeta:obj (default: { expire: 3600 * 1000 })` - The default meta added
  to every hash. The bank checks `expire` (ms) meta when removing expired hashes.
  This is merged with the meta created when `b.add(obj, meta)`ing a hash.
- `interval:int (default: 60 * 1000)` - How often (in ms) to purge expired
  hashes.

### using instance
- `b.add(any, [meta:obj]) -> hash` - Takes any object to convert to a hash and an
  meta object with `expire` time for the hash. Will use the default expire time if not
  provided.
- `b.exists(any) -> bool` - Tells you if a hash for the object exists in the bank.
- `b.hashExists(hash) -> bool` - Tells you if a hash exists in the bank.
- `b.remove(any) -> bool` - Remove a hash given the object. Returns true if
  found and deleted, otherwise false.
- `b.hashRemove(hash) -> bool` - Removes a hash given the hash. Returns true if
  found and deleted, otherwise false.
- `b.getMeta(any) -> obj` - Gets the meta data about hash from object like `expire`.
- `b.getHashMeta(hash) -> obj` - Gets the meta data about hash from hash like `expire`.
- `b.start() -> b` - Starts the bank running at the specified interval or the default.
- `b.stop() -> b` - Stops the bank running.

### special meta object properties
- `expire` - The expire time (in ms) for a hash.

## Installation
Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.


```bash
npm install hash-bank --save
```

## License
ISC
