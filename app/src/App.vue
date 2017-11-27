<template>
  <div id="app">
    <NavHeader></NavHeader>
          <router-view></router-view>
  </div>
</template>

<script>
import NavHeader from './components/general/NavHeader'

export default {
  name: 'app',
  components: {
    NavHeader
  },
  
}
</script>

<style>
  body {
    margin: 0;
  }
  .center {
    text-align: center;
    margin: 0 auto;
  }

  small, p, span {
    font-family: MetricWeb,sans-serif;
  }
</style>
