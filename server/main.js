Meteor.startup(function() {
  UploadServer.init({
    tmpDir: Meteor.settings.tmpDir || "/Work/photo-stream/server/.uploads/tmp",
    uploadDir: Meteor.settings.uploadDir || "/Work/photo-stream/server/.uploads/",
    checkCreateDirectories: true,
    acceptFileTypes: /.(gif|jpe?g|png)$/i,
    mimeTypes: {
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif"
    },
    getFileName: function(fileInfo, formData) {
      var segs = fileInfo.name.split('.');
      return Date.now() + Math.random().toString().split('.')[1] + '.' + segs[segs.length - 1].toLowerCase();
    }
  });
});

Meteor.publish('photos', function() {
  return [Photos.find(), Users.find()];
})

Meteor.publish('userInfo', function() {
  return Meteor.users.find(this.userId);
});

Accounts.onCreateUser(function(options, user) {

  if (!options.fullname || !String(options.fullname).trim().length) {
    throw new Meteor.Error('bad-request', 'Fullname may not be empty');
  }

  // Use provided profile in options, or create an empty object
  user.profile = options.profile || {};
  // Assigns first and last names to the newly created user object
  user.profile.fullname = options.fullname;
  // Returns the user object
  return user;
});
