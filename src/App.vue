<template>
  <div id="root-view">
    <router-view/>
  </div>
</template>
<script lang="ts">
  import "@/styles/app.styl";
  import "@/styles/yf.styl";
  import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class App extends Vue {
    private created() {
      console.log('app组价初始化');
    }
  }
</script>

<style lang="stylus">

</style>
