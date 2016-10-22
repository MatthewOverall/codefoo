<template lang="jade">
  div
    ul
      li(v-for="project in projects")
        a(@click="CHANGE_ACTIVE_PROJECT(project.id)") {{project.name}} | {{project.owner.displayName}} | {{project.files}}
</template>

<script>

import { dataStore } from '../store/dataStore/dataStore'
import { mapActions } from 'vuex'

export default {
  data(){
    return {
      projects: this.$store.getters.projects || [],
    }
  },
  beforeMount () {
    this.loadProjects()
  },
  methods:{
    ...mapActions([
      'CHANGE_ACTIVE_PROJECT'
    ]),
    async loadProjects(){
      await this.$store.dispatch('FETCH_PROJECTS')
      this.projects = this.$store.getters.projects
    }
  }
}
</script>

<style lang="stylus">
  .news-item
    background-color #fff
    padding 20px 30px 20px 80px
    border-bottom 1px solid #eee
    position relative
    line-height 20px
    .score
      color #ff6600
      font-size 1.1em
      font-weight 700
      position absolute
      top 50%
      left 0
      width 80px
      text-align center
      margin-top -10px
    .meta, .host
      font-size .85em
      color #999
      a
        color #999
        text-decoration underline
        &:hover
          color #ff6600
</style>
