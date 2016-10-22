<template lang="jade">
  div
    ul
      li(v-for="tab in files" @click="setActiveTab(tab)")
        | {{tab.name}}
    .editor.bigger
</template>

<script>
import {Editor} from './editor'

export default {
  data(){
    return {
      editor: null,
      editorOptions:{
        theme: 'vs-dark'
      }
    }
  },
  mounted(){
    this.editor = new Editor(this.$el.querySelector('.editor'), this.editorOptions)
    // monaco.editor.create(this.$el.querySelector('.editor'), this.editorOptions)
  },
  computed:{
    files() {
      return this.$store.getters.activeProject.files || []
    }
  },
  watch:{
    files(newVal, oldVal){
      console.log('files changed',newVal, oldVal)
      this.editor.reset()
      newVal.forEach(x => {
        //this.editor.loadFile(x)
        this.editor.openFile(x)
      })
    }
  },
  methods:{
    setActiveTab(tab){
      console.log('active tab',tab)
      this.editor.openFile(tab)
    }
  }
}
</script>

<style lang="stylus">
  .bigger
    height 50px
</style>
