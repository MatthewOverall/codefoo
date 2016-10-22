<template lang="jade">
  div
    | {{activeProject}}
    project-list
    editor(v-if="activeProject")
</template>

<script>
import ProjectList from './ProjectList.vue'
import Editor from './Editor.vue'
import { mapGetters } from 'vuex'

export default {
  components:{
      'project-list': ProjectList,
      'editor' : Editor
  },
  data(){
    return {
      //activeProject: this.$store.state.activeProject || {},
    }
  },
  beforeMount(){
    this.loadProject('-KQxWp0ZXEuR-px7DOaj')
  },
  methods: {
    async loadProject(id){
      await this.$store.dispatch('CHANGE_ACTIVE_PROJECT',id)
    },
  },
  computed:{
    ...mapGetters([
      'activeProject'
    ]),
  }
}
</script>

<style lang="stylus">

</style>
