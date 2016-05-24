<template>
    <div>
      <ul id="comments-for-{{photo._id}}">
        <li v-for="comment in photo.comments | orderBy 'createdAt' -1">
          {{comment.message}}
          <br/>
          <strong style="color: #365899">{{getUserById(comment.userId).fullname}}</strong> - {{fromNow(comment.createdAt)}}
        </li>
      </ul>
      <form @submit.prevent="commentPhoto(photo)">
        <div class="form-group">        
          <input v-if="userId" class="form-control" v-model="message" placeholder="write your thought about this photo..." />
          <input v-if="!userId" class="form-control" placeholder="please login to comment..." disabled="disabled" />
        </div>
      </form>
    </div>
</template>
<script>

import moment from 'moment'

module.exports = {
    props: ['photo', 'users'],
    data: function () {
        return {
            userId: Meteor.userId(),
            message: '',
            timestamp: new Date()
        }
    },
    methods: {
        fromNow: function(date) {          
          return moment(date).from(this.timestamp);
        },
        getUserById: function(id) {      
          return this.users[id] || {}
        },
        commentPhoto: function(photo) {
          var message = this.message
          var id = photo._id      
          Meteor.call('commentPhoto', id, message, (error) => {
            
            if (error) {
              return swale(error);              
            }

            this.message = '';
            let ele = document.getElementById('comments-for-' + photo._id).scrollTop = 0;                        
          })
        }
    },
    created: function() {
      this.interval = setInterval(() => {      
        this.$set('timestamp', new Date());
      }, 10000);

    },
    destroyed: function() {
      clearInterval(this.interval);
    }
}    
</script>
<style lang="sass" scoped>
  ul {
    overflow: auto;
    max-height: 500px;
    padding: 0px;
  }
  ul li {
    /* These are technically the same, but use both */
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
    margin-bottom: 5px;
    padding: 5px;
    padding-left: 10px;

    &:hover {
      background: #f9f9f9;
    }  
  }
  ul li:nth-of-type(odd) {
    border-left: 2px solid #ffe0c9;
  }
  ul li:nth-of-type(even) {
    border-left: 2px solid #b5d8f4;
  }
</style>