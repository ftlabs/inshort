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

  pre {
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap; /* Opera */
    white-space: -o-pre-wrap; /* Opera */
    height: auto;
    max-height: 200px;
    overflow: auto;
    white-space: pre-wrap;
}

  small, p, span {
    font-family: MetricWeb,sans-serif;
  }
</style>
