<template>
  <div>
    <input type="file" name="input-file" id="input-file" accept="image/*" @change="fileInputChange">        
    <div v-if="!isCompleted" id="upload-form" class="block-center col-lg-offset-1 col-lg-10" @click="selectPhoto">
      <div v-if="!inProgress">Select your photo...</div>
      <div v-if="inProgress">{{progress}}%</div>
    </div>
    <div v-if="imageUrl" class="row">
      <form @submit.prevent="addPhoto">
        <img id="uploaded-image" :src="imageUrl" class="img-responsive center-block" @click="selectPhoto"/>
        <div class="form-group">
          <label class="col-lg-12">Title: <input class="form-control" type="text" placeholder="title of your post..." v-model="title" required></label>
        </div>
        <div class="form-group">
          <label class="col-lg-12">Caption (optional): <textarea class="form-control" type="text" placeholder="write something about your photo..." v-model="caption" rows="3"></textarea></label>
        </div>
        <div class="form-group center-block">
          <label class="col-lg-12">
            <button type="button" class="btn btn-link pull-right" @click="closeForm">Cancel</button>
            <button type="submit" class="btn btn-success pull-right">Post photo</button>            
          </label>          
        </div>
      </form>
    </div>
</template>
<style>
  #input-file {
    visibility: hidden;
  }  
  
  #uploaded-image {
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    border: 10px solid #fff;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  #upload-form {
    height: 400px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    border: 10px solid #fff;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    /*background: url(data:image/gif;base64,R0lGODlhCgAKAIAAAOLi4v///yH5BAAHAP8ALAAAAAAKAAoAAAIRhB2ZhxoM3GMSykqd1VltzxQAOw==);*/
    background: #e5e5e5;
    font-family: 'Lobster', cursive;
    font-size: 50px;
    cursor: pointer;
  }
</style>
<script>

  let initialState = () => {
    return {
      action: '/upload',
      id: 'input-file',
      name: 'input-file',
      imageUrl: '',
      caption: '',
      title: '',
      myFiles: [], // a container for the files in our field
      inProgress: false,
      isCompleted: false,
      progress: 0
    };
  }

  module.exports = {    
    data: initialState,
    methods: {
      selectPhoto: function() {
        document.getElementById(this.id).click();
      },
      addPhoto: function () {
        
        if (!this.title.trim()) {
           return swale({
            reason: 'Title may not be empty.'
           });
        }

        if (!this.imageUrl.trim()) {
          return swale({
            reason: 'Please select your photo.'
           });
        }

        Meteor.call('addPhoto', this.title, this.caption, this.imageUrl, (error) => {            
          if (error) {
            return swale(error);
          }

          this.closeForm();

        });             

      },
      closeForm: function() {
        this.$data = initialState();
        this.$dispatch('photoAdded');
      },
      fileInputChange: function() {
        // get the group of files assigned to this field
        var ident = this.id || this.name
        this.myFiles = document.getElementById(ident).files;
        this.fileUpload();        
      },
      _onProgress: function(e) {
        // this is an internal call in XHR to update the progress
        e.percent = (e.loaded / e.total) * 100;        
        this.progress = Math.floor(e.percent);        
      },
      _handleUpload: function(file) {
        var form = new FormData();
        var xhr = new XMLHttpRequest();
        try {
          form.append('Content-Type', file.type || 'application/octet-stream');          
          // our request will have the file in the ['file'] key
          form.append('file', file);
        } catch (err) {
          swale(err);
          return;
        }

        return new Promise((resolve, reject) => {

          xhr.upload.addEventListener('progress', this._onProgress, false);

          xhr.onreadystatechange = function() {
            if (xhr.readyState < 4) {
              return;
            }
            if (xhr.status < 400) {              
              var res = JSON.parse(xhr.responseText);              
              resolve(res);
            } else {
              var err = JSON.parse(xhr.responseText);
              err.status = xhr.status;
              err.statusText = xhr.statusText;              
              reject(err);
            }
          }.bind(this);

          xhr.onerror = function() {
            var err = JSON.parse(xhr.responseText);
            err.status = xhr.status;
            err.statusText = xhr.statusText;            
            reject(err);
          }.bind(this);

          xhr.open('POST', this.action, true);
          if (this.headers) {
            for(var header in this.headers) {
              xhr.setRequestHeader(header, this.headers[header]);
            }
          }
          xhr.send(form);
         
        });
      },
      fileUpload: function() {

        this.inProgress = true;

        if(this.myFiles.length > 0) {
          // a hack to push all the Promises into a new array
          var arrayOfPromises = Array.prototype.slice.call(this.myFiles, 0).map(file => {
            return this._handleUpload(file);
          });
          // wait for everything to finish
          Promise.all(arrayOfPromises).then(allFiles => {                
            this.isCompleted = true;            
            this.imageUrl = this.action + allFiles[0].files[0].path;
          }).catch(err => {
            swale(err);            
          });
        } else {
          // someone tried to upload without adding files          
          swale(new Error("No files to upload for this field"));
        }
      }
    }
  }
</script>