import HashBank from './'


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

