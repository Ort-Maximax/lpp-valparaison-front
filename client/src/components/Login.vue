<template>
  <div>
    <h2>Login</h2>
    <p v-if="$route.query.redirect">
      You need to login first.
    </p>
    <form @submit.prevent="login" autocomplete="off">
      <label><input v-model="email" placeholder="email" v-focus></label>
      <label><input v-model="pass" placeholder="password" type="password"></label><br>
      <button type="submit">login</button>
      <!--
      <a href="https://dev-438691.oktapreview.com/oauth2/v1/authorize?idp=0oaed8nypg1lcekav0h7&client_id=0oaed77se2TFtDWQh0h7&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080&state=WM6D&nonce=YsG76jo">
      G+ Login</a>
      -->
      <p v-if="error" class="error">Bad login information</p>
    </form>
  </div>
</template>

<script>
  import auth from '../auth'
  export default {
    data () {
      return {
        host: window.location.host,
        email: '',
        pass: '',
        error: false
      }
    },
    methods: {
      login () {
        auth.login(this.email, this.pass, loggedIn => {
          if (!loggedIn) {
            this.error = true
          } else {
            this.$router.replace(this.$route.query.redirect || '/')
          }
        })
      }
    }
  }
</script>

<style>
  .error {
    color: red;
  }
</style>