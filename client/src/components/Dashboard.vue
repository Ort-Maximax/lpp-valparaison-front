<template>
  <div>
    <h2>Dashboard</h2>
    <p>Oh shit you managed to log in, <b>{{name}}</b>!</p>
  </div>
</template>
<script>
  import auth from '../auth'
  export default {
    data () {
      return {
        name: auth.getName()
      }
    }
  }
</script>