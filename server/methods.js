var https = Npm && Npm.require('https');
var url = Npm && Npm.require('url');

Meteor.methods({
  user_profile_name: function () {
    var user = Meteor.user();
    if (user && user.username !== undefined && user.profile.name === undefined) {
      var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
    }
  },
  user_set_owner: function () {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['owner']);
    }
  },
  user_set_waiter: function (placeId) {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['waiter']);
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.place': placeId}});
    }
  },
  delete_order: function(orderId) {
    check(orderId, String);
    var localOrder = Orders.findOne({_id: orderId});
    if ( _.contains(localOrder.waiter, Meteor.userId()) || (localOrder.user == Meteor.userId() && localOrder.status <= 1) ) {
      Lines.remove({order: localOrder._id});
      Orders.remove({_id: localOrder._id});
      // console.log(localOrder, 'Deleted');
      return true;
    } else {
      // console.log(localOrder, 'Not Deleted');
      return false;
    }
  },
  onlineUsersCount: function() {
    return Meteor.users.find({ "status.online": true }).count();
  },
  getTags: function(tagsGroup) {
    var availableTags = Meteor.tags.find({group: tagsGroup}, {fields: {name: 1, _id: 0}}).fetch();
    // console.log(availableTags);
    source = [];
    if (availableTags && availableTags.length >0) {
      _.each(availableTags, function(tag) {
        source.push(tag);
      });
      // console.log(source);
      return source;
    }
  },
  clean_the_place: function (placeId) {
    Products.remove({places: placeId});
    Sets.remove({places: placeId});
    Orders.remove({place: placeId});
    OrdersNumbers.remove({_id: placeId});
    Lines.remove({place: placeId});
    Options.remove({place: placeId});
    Payments.remove({place: placeId});
    Notes.remove({place: placeId});
  },
  tiny_images: function (imageId) {
    var image = Images.findOne({_id: imageId});
    // console.log(image.getFileRecord());
    var input = image.createReadStream('images');
    var output = image.createWriteStream('images');
    // console.log(input);

    // var tiny = function(data) {
    //   HTTP.post('https://api.tinypng.com/shrink', {auth: 'api:r_NMZYPUA3YANl0rUjvGFHL8XSc8OtAx', content: data}, function (response){
    //     console.log(response);
    //   });
    // };
    // input.pipe(tiny);
    var key = "r_NMZYPUA3YANl0rUjvGFHL8XSc8OtAx";
    var options = url.parse("https://api.tinypng.com/shrink");
    options.auth = "api:" + key;
    options.method = "POST";

    var request = https.request(options, function(response) {
      if (response.statusCode === 201) {
        /* Compression was successful, retrieve output from Location header. */
        https.get(response.headers.location, function(response) {
          response.pipe(output);
        });
      } else {
        /* Something went wrong! You can parse the JSON body for details. */
        console.log("Compression failed");
      }
      console.log(response.statusCode);
    });
    input.pipe(request);
  },
  delete_image: function (imageId) {
    Images.remove({_id: imageId});
  }
});
