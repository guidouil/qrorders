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
  user_unset_owner: function () {
    if (Meteor.userId()) {
      var placeCount = Places.find({owner: Meteor.userId()}).count();
      console.log(placeCount);
      if (placeCount === 0) {
        Roles.removeUsersFromRoles(Meteor.userId(), ['owner']);
      }
    }
  },
  user_set_waiter: function (placeId) {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['waiter']);
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.place': placeId}});
    }
  },
  user_unset_waiter: function (placeId) {
    if (Meteor.userId()) {
      var placeCount = Places.find({waiter: Meteor.userId()}).count();
      if (placeCount === 0) {
        Roles.removeUsersFromRoles(Meteor.userId(), ['waiter']);
      }
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.place': ''}});
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
  },
  update_email: function (newEmail) {
    var count = Meteor.users.find({'emails.address': newEmail}).count();
    if (count === 0) {
      Meteor.users.update({_id: Meteor.userId()}, {$set: {emails: [{address: newEmail}]}});
      return true;
    }
    return false;
  },
  notify_order_status: function (orderId, userId, newStatus) {
    var order = Orders.findOne({_id: orderId});
    var place = Places.findOne({_id: order.place});

    var statusStr = function(status) {
      var result = false;
      switch (status) {
        case 0:
          result = 'Annulée';
          break;
        case 1:
          result = 'En création';
          break;
        case 2:
          result = 'Validée';
          break;
        case 3:
          result = 'En cours';
          break;
        case 4:
          result = 'Servie';
          break;
        default :
          result = 'Houston?';
          break;
      }
      return result;
    };

    var contactEmail = function (user) {
      if (user.emails && user.emails.length)
        return user.emails[0].address;
      if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;
      if (user.services && user.services.google && user.services.google.email)
        return user.services.google.email;
      if (user.services && user.services.twitter && user.services.twitter.email)
        return user.services.twitter.email;
      return null;
    };

    var sendMessage = function (toId, msg) {
      var from = 'JeCMD.fr';
      var to = Meteor.users.findOne(toId);
      var fromEmail = 'jecmd@jecmd.fr';
      var toEmail = contactEmail(to);
      Email.send({
        from: fromEmail,
        to: toEmail,
        replyTo: fromEmail || undefined,
        subject: "JeCMD : #" + order.number + "@" + place.placename +' -> '+statusStr(order.status),
        text: "Bonjour "+to.profile.name+",\n\n"+
          msg+
          "Merci d'utiliser JeCMD.fr\n\n"+
          Meteor.absoluteUrl()+" ici c'est moi qui commande.\n"
      });
    };

    var message = "La commande #" + order.number + " chez " + place.placename + " viens de passer en statut : " + statusStr(order.status) + "\n" +
    "Vous pouvez consulter cette commade à cette adresse : \n" + Meteor.absoluteUrl() + "editorder/" + order.place + "/" + order._id + "\n\n";

    sendMessage(userId, message);
  },
  get_waiters: function (placeId) {
    var contactEmail = function (user) {
      if (user.emails && user.emails.length)
        return user.emails[0].address;
      if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;
      if (user.services && user.services.google && user.services.google.email)
        return user.services.google.email;
      if (user.services && user.services.twitter && user.services.twitter.email)
        return user.services.twitter.email;
      return null;
    };
    var place = Places.findOne({_id: placeId});
    var result = [];
    _.each(place.waiter, function(waiterId) {
      var user = Meteor.users.findOne({_id: waiterId});
      if (user) {
        var waiter = {'_id': waiterId, 'name': user.profile.name, 'mail':  contactEmail(user)};
        result.push(waiter);
      }
    });
    return result;
  },
  remove_place_waiter: function (placeId, waiterId) {
    var place = Places.findOne({_id: placeId});
    if (place && _.contains(place.waiter, waiterId)) {
      Places.update({_id: placeId}, {$pull: {waiter: waiterId}});
      var waiter = Meteor.users.findOne({_id: waiterId});
      if (waiter.profile.place === placeId) {
        Meteor.user.update({_id:waiterId}, {$set: {'profile.place': ''}});
      }
      var nbPlaces = Places.find({waiter: waiterId}).count();
      if (nbPlaces === 0) {
        Roles.removeUsersFromRoles(waiterId, ['waiter']);
      }
      return true;
    }
  },
  add_place_waiter: function (placeId, mail) {
    var waiter = Meteor.users.findOne({'emails.address': mail});
    if (!waiter) {
      waiter = Meteor.users.findOne({'user.services.google.email': mail});
    }
    if (!waiter) {
      waiter = Meteor.users.findOne({'user.services.facebook.email': mail});
    }
    if (!waiter) {
      waiter = Meteor.users.findOne({'user.services.twitter.email': mail});
    }
    if (waiter && waiter._id) {
      Places.update({_id: placeId}, {$addToSet: {waiter: waiter._id}});
      Roles.addUsersToRoles(waiter._id, ['waiter']);
      Meteor.user.update({_id:waiterId}, {$set: {'profile.place': placeId}});
      return true;
    }
  },
  get_owners: function (placeId) {
    var contactEmail = function (user) {
      if (user.emails && user.emails.length)
        return user.emails[0].address;
      if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;
      if (user.services && user.services.google && user.services.google.email)
        return user.services.google.email;
      if (user.services && user.services.twitter && user.services.twitter.email)
        return user.services.twitter.email;
      return null;
    };
    var place = Places.findOne({_id: placeId});
    var result = [];
    _.each(place.owner, function(ownerId) {
      var user = Meteor.users.findOne({_id: ownerId});
      if (user) {
        var owner = {'_id': ownerId, 'name': user.profile.name, 'mail':  contactEmail(user)};
        result.push(owner);
      }
    });
    return result;
  },
  remove_place_owner: function (placeId, ownerId) {
    var place = Places.findOne({_id: placeId});
    if (place && place.owner.length > 1 && _.contains(place.owner, ownerId)) {
      Places.update({_id: placeId}, {$pull: {owner: ownerId}});
      var nbPlaces = Places.find({owner: ownerId}).count();
      if (nbPlaces === 0) {
        Roles.removeUsersFromRoles(ownerId, ['owner']);
      }
      return true;
    }
  },
  add_place_owner: function (placeId, mail) {
    var owner = Meteor.users.findOne({'emails.address': mail});
    if (!owner) {
      owner = Meteor.users.findOne({'user.services.google.email': mail});
    }
    if (!owner) {
      owner = Meteor.users.findOne({'user.services.facebook.email': mail});
    }
    if (!owner) {
      owner = Meteor.users.findOne({'user.services.twitter.email': mail});
    }
    if (owner && owner._id) {
      Places.update({_id: placeId}, {$addToSet: {owner: owner._id}});
      Roles.addUsersToRoles(owner._id, ['owner']);
      return true;
    }
  }
});
