const hash = require('object-hash')


const identity = x => x

export default function HashBank ({
  serialize = identity,
  defaultMeta = { expire: 3600 * 1000 },
  interval = 60 * 1000
} = {}) {
  let store = {}
  let intervalId = null

  function getHash (obj) {
    return hash(serialize(obj))
  }

  function add (obj, meta={}) {
    let m = Object.assign({}, defaultMeta, meta)
    m.expire += new Date().getTime()
    const hash = getHash(obj)
    store[hash] = m
    return hash
  }

  function exists(obj) {
    return !!store[getHash(obj)]
  }

  function hashExists(hash) {
    return !!store[hash]
  }

  function remove(obj) {
    const hash = getHash(obj)
    return hashRemove(hash)
  }

  function hashRemove(hash) {
    if (hashExists(hash)) {
      delete store[hash]
      return true
    }
    return false
  }

  function getMeta(obj) {
    return getHashMeta(getHash(obj))
  }

  function getHashMeta(hash) {
    return store[hash]
  }

  function _tick(now) {
    store = Object.keys(store).reduce((acc, hash) => {
      if (store[hash].expire - now > 0) {
        acc[hash] = store[hash]
      }
      return acc
    }, {})
  }

  function start() {
    _tick(new Date().getTime())
    if (!intervalId) intervalId = setInterval(() => {
      _tick(new Date().getTime())
    }, interval)
    return api
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    return api
  }

  const api = Object.freeze({
    add,
    exists,
    hashExists,
    remove,
    hashRemove,
    getHashMeta,
    start,
    stop,
    _tick // for testing
  })
  return api
}
