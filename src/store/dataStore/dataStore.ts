import * as firebase from 'firebase'
import * as FB from './firebaseStore'
import { FirebaseAdapter } from 'js-data-firebase'
// import { FirebaseAuthStore } from '../../auth/firebase-auth'

let config = {
  apiKey: 'AIzaSyBWqcFZa4n0RMP6_HoYf1_U7r8mWQB7UnM',
  authDomain: 'codefoo-5a25b.firebaseapp.com',
  databaseURL: 'https://codefoo-5a25b.firebaseio.com',
  storageBucket: 'codefoo-5a25b.appspot.com',
}

const firebaseApp = firebase.initializeApp(config)
// const authStore = new FirebaseAuthStore(firebaseApp)

// authStore.onAuthStateChanged((user) => store.commit('SET_USER') workbench.authStateChanged(user))

const dataStore = new FB.Store({
  mapperDefaults: {
    beforeCreate(props: any, opts: any): any {
      applyTimestamps(props)
      return props
    },
    beforeUpdate(id: any, props: any, opts: any): any {
      console.log(props, opts)
      applyTimestamps(props)
      return props
    },
  }
});

function applyTimestamps(props: any) {
  props.created = props.created || (<any>firebase.database).ServerValue.TIMESTAMP // || new Date().toISOString()
  props.modified = (<any>firebase.database).ServerValue.TIMESTAMP // || new Date().toISOString()
}

const adapter = new FirebaseAdapter({ db: firebase.database() })
dataStore.registerAdapter('firebase', adapter, { 'default': true })

dataStore.defineMapper('project', {
  endpoint: 'projects',
  // recordClass: Project,
  relations: {
    belongsTo: {
      user: {
        localKey: 'ownerId',
        localField: 'owner'
      }
    },
    hasMany: {
      file: {
        foreignKey: 'projectId',
        localField: 'files'
      }
    }
  }
})

dataStore.defineMapper('user', {
  endpoint: 'users',
  // recordClass: File,
  relations: {
    hasMany: {
      project: {
        foreignKey: 'ownerId',
        localField: 'projects'
      }
    }
  }
})

dataStore.defineMapper('file', {
  endpoint: 'files',
  // recordClass: File,
  relations: {
    belongsTo: {
      project: {
        localKey: 'projectId',
        localField: 'project'
      }
    }
  },
  schema: {
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      content: { type: 'string' },
      readonly: { type: 'boolean' },
      projectId: { type: 'string' },
    }
  }
})

export {
  dataStore,
}
