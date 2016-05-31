<template>
  <form class="login-form" @submit.prevent="login(email, password)">
    <div class="form-group">
      <label for="inputEmail">Email address</label>
      <input type="email" class="form-control" id="inputEmail" placeholder="Email" name="email" v-model="email" required>
    </div>
    <div class="form-group">
      <label for="inputPassword">Password</label>
      <input type="password" class="form-control" id="inputPassword" placeholder="Password" name="password" v-model="password" required>
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-success btn-responsive">Login</button>
    </div>
  </form>
</template>
<script>
module.exports = {
    props: ['login'],
    data: function () {
        return {
            email: '',
            password: ''
        }
    }
}    
</script>