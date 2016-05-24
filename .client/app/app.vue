<template>  
  <div class="photo-app container-fluid">
    <div class="row">
      <article class="col-lg-offset-2 col-lg-8 bg-success header">
        <div v-if="userId">
          <h1>Hello "{{user.fullname}}"!</h1>
          <h3>You can <a href="javascript:;" @click="showUploadForm">post photo</a> or <a href="javascript:;" @click="logout">logout</a>.</h3>
          <upload-form v-if="showUpload"></upload-form>          
        </div>
        <div v-if="!userId">
          <h1>Welcome guest!</h1>
          <h3>Please <a href="javascript:;" @click="showLoginForm">login</a> or <a href="javascript:;" @click="showRegisterForm">register</a>.</h3>
          <registration-form v-if="showRegister" :register="register"></registration-form> 
          <login-form v-if="showLogin" :login="login"></login-form>
        </div>                
      </article>
    </div>    
    <photo-stream></photo-stream>
  </div>
</template>

<script>

import RegistrationForm from './components/registration-form.vue'
import LoginForm from './components/login-form.vue'
import UploadForm from './components/upload-form.vue'
import PhotoStream from './components/photo-stream.vue'

module.exports = {

  data: function () {
    return {      
      userId: Meteor.userId(),
      user: {},
      showUpload: false,
      showLogin: false,
      showRegister: false    
    }
  },
  components: {    
    RegistrationForm,
    LoginForm,
    UploadForm,
    PhotoStream
  },
  methods: {
    showUploadForm() {
      this.showUpload = !this.showUpload;
    },
    showLoginForm() {      
      this.showLogin = true;
      this.showRegister = false;
    },
    showRegisterForm() {
      this.showLogin = false;
      this.showRegister = true;
    }, 
    register: function(email, password, fullname) {
        Accounts.createUser({
            fullname: fullname,
            email: email,
            password: password
        }, (error) => {
          if (!error) {
            this.userId = Meteor.userId();
            this.user = { 
              _id: Meteor.userId(),
              fullname: fullname,
              email: email
            };            
          } else {
            swale(error);           
          }
        });
    },
    login: function(email, password) {
        Meteor.loginWithPassword(email, password, error => {
            if (!error) {
              this.userId = Meteor.userId()
            }
            else {
              swale(error);
            }
        });
    },
    logout: function() {      
        Meteor.logout(() => {        
          this.userId = null;
          this.user = { profile: {} };
        });      
    }
  },
  events: {
    photoAdded: function() {
      this.showUpload = false;
    }
  },
  created: function() {    

    this.subscription = Meteor.subscribe('userInfo');

    Tracker.autorun(() => {

      const user = Meteor.user();

      if (user) {
        this.user = {
          _id: Meteor.userId(),
          fullname: user.profile.fullname,
          email: user.emails[0].address
        }
      }
      
    });
    
  },
  destroyed: function() {
    this.subscription.stop()
  }
}

</script>
<style lang="sass">
body {
  background: #f5f5f5;
  color: #34495e;
  border-color: #ededed;
  margin: 0;
  line-height: 25px;
}

img.center-block {
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  border: 10px solid #fff;
  margin-top: 10px;
  margin-bottom: 10px;
}

article {
  background: #ffffff;
  padding: 40px !important;
  margin-bottom: 30px;
  font-size: 14px !important;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);

  h1, h2 {
    margin-top: 0px;
    font-family: 'Lobster', cursive;
  }  
}

@media only screen and (min-width: 1200px) {
  body {
      border: 10px solid #ededed;
      font-size: 17px;      
      padding-top: 30px; 
  }
}

@media only screen and (max-width: 1200px) {
  .btn {
    width: 100% !important;
  }
}

</style>
