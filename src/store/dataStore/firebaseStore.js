const JSData = require('js-data')
const FBA = require('js-data-firebase')
const utils = JSData.utils
const FirebaseAdapter = FBA.FirebaseAdapter

Object.defineProperties(JSData.Record.prototype, {
  'watch': {
    value(handler) {
      if (this.isNew()) {
        return
      }
      if (handler) {
        this.on('fb-changed', handler, this)
      }
      return this._mapper().datastore.addWatch(this)
    }
  },
  'removeWatch': {
    value() {
      this._mapper().datastore.removeWatch(this)
    }
  }
})

Object.defineProperty(Array.prototype, 'watch', {
  value(handler) {
    return this.forEach(item => {
      if (typeof item.watch === 'function') {
        item.watch(handler)
      }
    })
  }
})

Object.defineProperty(JSData.utils.Promise.prototype, 'watch', {
  value(handler) {
    return this.then((result) => {
      if (typeof result.watch === 'function') {
        result.watch(handler)
      }
      return result
    })
  }
})

class FirebaseStore extends JSData.DataStore {
  constructor(opts) {
    super(opts)
    this.refCache = {}
  }

  getRefCache(record, mapper) {
    mapper = mapper || record._mapper()
    let id = utils.get(record, mapper.idAttribute)
    let cache = this.refCache[mapper.name] || {}
    return cache[id]
  }

  setRefCache(ref, record, mapper) {
    mapper = mapper || record._mapper()
    let id = utils.get(record, mapper.idAttribute)
    this.refCache[mapper.name] = this.refCache[mapper.name] || {}
    this.refCache[mapper.name][id] = ref
  }

  getRef(record, mapper) {
    mapper = mapper || record._mapper()
    let id = utils.get(record, mapper.idAttribute)
    let adapter = this.getAdapter()
    return adapter.getRef(mapper).child(id)
  }

  addWatch(record) {
    if (this.getRefCache(record)) {
      console.log("Already watching ref")
      return
    }
    let ref = this.getRef(record)
    this.setRefCache(ref, record)
    ref.on('value', (dataSnapshot) => {
      console.log("FB UPDATED", record)
      let updatedRecord = dataSnapshot.val()
      let hasChanged = utils.areDifferent(updatedRecord, record)
      utils.set(record, updatedRecord)
      if (hasChanged) {
        setTimeout(() => {
          record.emit('fb-changed', record, updatedRecord)
        })
      }
    })

  }

  removeWatch(record) {
    let ref = this.getRefCache(record)
    if (ref) {
      ref.off('value')
      this.setRefCache(undefined, record)
    }
  }

  remove(name, id, opts) {
    let record = super.remove(name, id, opts)
    if (record.removeWatch) {
      record.removeWatch()
    }
  }

  removeAll(name, query, opts) {
    let records = super.removeAll(name, query, opts)
    records.forEach(record => {
      if (record.removeWatch) {
        record.removeWatch()
      }
    })
  }
}

exports.Store = FirebaseStore
