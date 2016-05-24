Meteor.methods({
  addPhoto: function(title, caption, url) {

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(title, String);
    check(caption, String);
    check(url, String);

    if (!title.trim()) {
      throw new Meteor.Error('bad-request', 'Title may not be empty');
    }

    if (!url.trim()) {
      throw new Meteor.Error('bad-request', 'Please select photo');
    }

    Photos.insert({
      title: title,
      caption: caption,
      url: url,
      likes: [],
      comments: [],
      createdAt: new Date(),
      createdBy: Meteor.userId()
    })

  },
  removePhoto: function(id) {

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Photos.remove(id)
  },
  likePhoto: function(id) {

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'Please login to like this photo.');
    }

    var photo = Photos.find(id);

    if (!photo.count()) {
      throw new Meteor.Error('photo-not-found');
    }

    if (~photo.fetch()[0].likes.indexOf(Meteor.userId())) {
      throw new Meteor.Error('already-liked-photo');
    }

    Photos.update(id, {
      $push: {
        'likes': Meteor.userId()
      }
    })

  },
  unlikePhoto: function(id) {

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    var photo = Photos.find(id);

    if (!photo.count()) {
      throw new Meteor.Error('photo-not-found');
    }

    Photos.update(id, {
      $pull: {
        'likes': Meteor.userId()
      }
    })

  },
  commentPhoto: function(id, message) {

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }    

    if (!message.trim()) {
      throw new Meteor.Error('comment-cannot-be-empty', "Please write something...");
    }

    if (!message.trim() > 500) {
      throw new Meteor.Error('comment-too-long', "Your message must be less than 500 characters.");
    }

    var photo = Photos.find(id);

    if (!photo.count()) {
      throw new Meteor.Error('photo-not-found');
    }

    Photos.update(id, {
      $push: {
        'comments': {
          _id: new Mongo.ObjectID(),
          userId: Meteor.userId(),
          message: message,
          createdAt: new Date()
        }
      }
    })

  },
  getUsers: function() {
    return Users.find().fetch()
  }
})
