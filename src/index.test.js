const test = require('ava')
const HashBank = require('./')


function sleep (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

test('should add to bank', async t => {
  let b = HashBank()
  const ahash = b.add('cats')
  t.is(true, b.exists('cats'))
})

test('should add to bank with expire', async t => {
  let b = HashBank()
  const ahash = b.add('cats', { expire: 1020200 })
  const meta = b.getHashMeta(ahash)
  t.is( true, !!meta.expire)
})

test('should remove from bank by obj', async t => {
  let b = HashBank()
  const ahash = b.add('cats')
  b.remove('cats')
  t.is(false, b.exists('cats'))
})

test('should remove from bank by hash', async t => {
  let b = HashBank()
  const ahash = b.add('cats')
  b.hashRemove(ahash)
  t.is(false, b.exists('cats'))
})

test('should check exists by hash', async t => {
  let b = HashBank()
  const ahash = b.add('cats')
  let exists = b.hashExists(ahash)
  t.is(true, exists)
  b.hashRemove(ahash)
  exists = b.hashExists(ahash)
  t.is(false, exists)
});

test('should get hash meta', async t => {
  let b = HashBank()
  const ahash = b.add('cats')
  const meta = b.getHashMeta(ahash)
  t.truthy(meta.expire)
})

test('should start and stop and expire', async t => {
  let b = HashBank({
    interval: 10
  })
  let aHash = b.add('cat', {expire: 25})
  let bHash = b.add('mouse', {expire: 75})
  b.start()
  t.is(true, b.hashExists(aHash))
  t.is(true, b.hashExists(bHash))
  await sleep(50)
  t.is(false, b.hashExists(aHash))
  t.is(true, b.hashExists(bHash))
  await sleep(50)
  t.is(false, b.hashExists(aHash))
  t.is(false, b.hashExists(bHash))
  b.stop()
  aHash = b.add('cats', {expire: 50})
  await sleep(100)
  t.is(true, b.hashExists(aHash))
})

test('should expire cache', async t => {
  let b = HashBank()
  const hash = b.add('cats', 200)
  const expire = b.getHashMeta(hash).expire
  t.is(true, b.hashExists(hash))
  b._tick(expire - 30)
  t.is(true, b.hashExists(hash))
  b._tick(expire)
  t.is(false, b.hashExists(hash))
})

test('serialize works', async t => {
  let b = HashBank({ serialize: (o) => {
    return o.mice
  }})
  const ahash = b.add({mice: 'cheese'})
  const ghash = b.add({ mice: 'cheese', hats: 2 })
  t.is(ahash, ghash)
})

