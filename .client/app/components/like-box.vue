<template>
  <div>
    <h4 v-if="photo.likes.indexOf(this.userId) === -1"><span @click="likePhoto(photo._id)" class="label label-default"><i class="glyphicon glyphicon-heart"></i> Like</span></h4>
    <h4 v-if="photo.likes.indexOf(this.userId) > -1"><span @click="unlikePhoto(photo._id)" class="label label-danger"><i class="glyphicon glyphicon-heart"></i> Liked</span></h4>
    {{ likeMessage }}
  </div>
</template>
<script>

import pluralize from 'pluralize'

module.exports = {
    props: ['photo', 'users'],
    data: function () {
        return {
            userId: Meteor.userId(),
            message: ''          
        }
    },
    methods: {
        getUserById: function(id) {      
          return this.users[id] || {}
        },
        likePhoto: function(id) {
          Meteor.call('likePhoto', id, swale)
        },
        unlikePhoto: function(id) {
          Meteor.call('unlikePhoto', id, swale)
        }
    },
    computed: {
      likeMessage: function () {
        const likes = this.photo.likes;
        const totalLike = likes.length;
        let message = ""

        if (!totalLike) {
          message = "Be the first to like this photo.";
        }
        else if (~likes.indexOf(this.userId)) {
          
          if (totalLike === 1) {
            message = "You liked this photo.";
          }
          else {
            message = "You and " + pluralize('other', totalLike - 1, true) + " liked this photo.";
          }              

        }
        else {
          message = pluralize('person', totalLike, true) + " liked this photo.";  
        }
                  
        return message;
      }
    }    
}    
</script>
<style scoped>
    .glyphicon {
        top: 2px;        
    }
    .label {
        cursor: pointer;
        padding-top: 5px;
    }
    h4 {
      display: inline-block;
    }
</style>