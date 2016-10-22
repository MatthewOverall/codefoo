import Vue from 'vue'
import Vuex from 'vuex'
import {
  dataStore
} from './dataStore/dataStore'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    activeProject: {},
    projects: {},
    editor: {
      tabs: [],
      activeTab: {}
    },
    // activeType: null,
    // itemsPerPage: 20,
    // items: {/* [id: number]: Item */ },
    // users: {/* [id: string]: User */ },
    // lists: {
    //   top: [/* number */],
    //   new: [],
    //   show: [],
    //   ask: [],
    //   job: []
    // }
  },
  actions: {
    FETCH_PROJECTS: async ({commit, state}) => {
      let projects = await dataStore.findAll('project')
      const ownerIds = [...new Set(projects.map(x => x.ownerId))]
      await Promise.all(ownerIds.map(ownerId => {
        return dataStore.find('user', ownerId).then((o) => {
        })
      }))
      commit('SET_PROJECTS', { projects })
    },
    ENSURE_PROJECT: async ({commit, state}, id) => {
      let project = await dataStore.find('project', id)
      if (!project.owner) {
        await dataStore.find('user', project.ownerId)
      }
      if (project.fileIds) {
        await Promise.all(project.fileIds.map(x => {
          return dataStore.find('file', x)
        }))
      }
      return project
    },
    CHANGE_ACTIVE_PROJECT: async ({commit, dispatch}, id) => {
      // clear the active project
      commit('SET_ACTIVE_PROJECT', { project: {}})
      let project = await dispatch('ENSURE_PROJECT', id)
      commit('SET_ACTIVE_PROJECT', { project })
      return project
    }
  },
  mutations: {
    SET_ACTIVE_PROJECT: (state, {project}) => {
      state.activeProject = project
    },
    SET_PROJECTS: (state, {projects}) => {
      projects.forEach(project => {
        if (project) {
          Vue.set(state.projects, project.id, project)
        }
      })
    }
  },
  getters: {
    activeProject: state => {
      return state.activeProject
    },
    projects(state) {
      return state.projects
    }
  }
})

export default store
