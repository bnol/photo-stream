<template>
    <div class="row" v-for="photo in photos">
      <article class="col-lg-offset-2 col-lg-8">        
        <h2>{{photo.title}}</h2>        
        <div>
        <span class="glyphicon glyphicon-time"></span>
        Posted by <strong>{{getUserById(photo.createdBy).fullname}}</strong> - <span v-text="photo.createdAt | moment 'calendar' | lowercase "></span> 
        <a @click="removePhoto(photo._id)" href="javascript:;" v-if="photo.createdBy == userId">(delete)</a>
        </div>
        <img :src="photo.url" class="img-responsive center-block">
        <div v-if="photo.caption" class="text-center">
          <mark>{{photo.caption}}</mark>
        </div>
        <br />
        <like-box :photo="photo" :users="users"></like-box>
        <comment-box :photo="photo" :users="users"></comment-box>
      </article>
    </div>
</template>
<script>

import CommentBox from './comment-box.vue'
import LikeBox from './like-box.vue'

module.exports = {    
    data: function () {
        return {
            userId: Meteor.userId(),
            users: {},
            photos: [],
        }
    },
    components: {
        CommentBox,
        LikeBox
    },
    methods: {
        getUserById: function(id) {      
          return this.users[id] || {}
        },
        removePhoto: function (id) {
          if (confirm('Do you really want to delete this photo?')) {
            Meteor.call('removePhoto', id)
          }          
        }  
    },
    created: function () {

        this.subscription = Meteor.subscribe('photos');

        Tracker.autorun(() => {      
          
          this.photos = Photos.find({}, {sort: {createdAt: -1}}).fetch();   

          Meteor.call('getUsers', (error, result) => {        
            var users = {};        
            result.forEach(user => {                 
              users[user._id] = {
                email: user.emails[0].address,
                fullname: user.profile.fullname
              }
            });        
            this.users = users;            
          });      

        });
    },

    destroyed: function () {
        this.subscription.stop()
    }
}    

</script>