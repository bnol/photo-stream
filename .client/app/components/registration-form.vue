<template>    
    <form @submit.prevent="register(email, password, fullname)">
        <div class="form-group">
          <label for="inputFullname2">Fullname</label>
          <input type="text" class="form-control" id="inputFullname2" placeholder="Fullname" name="fullname" v-model="fullname" required>
        </div>
        <div class="form-group">
          <label for="inputEmail2">Email address</label>
          <input type="email" class="form-control" id="inputEmail2" placeholder="Email" name="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="inputPassword2">Password</label>
          <input type="password" class="form-control" id="inputPassword2" placeholder="Password" name="password" v-model="password" required>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-success btn-responsive">Register</button>
        </div>
    </form>
</template>
<script>

module.exports = {
    props: ['register'],
    data: function () {
        return {
            email: '',
            password: '',
            fullname: ''
        }
    }
}    

</script>