Meteor.publish('Places', function () {
  return Places.find({});
});

Meteor.publish('Images', function () {
  return Images.find({});
});

Meteor.publish('Products', function(placeId){
  return Products.find({places: placeId});
});

Meteor.publish('Sets', function(placeId){
  return Sets.find({places: placeId});
});

Meteor.publish('Orders', function(placeId){
  return Orders.find({place: placeId, $or:[{user: this.userId}, {waiter: this.userId}]});
});

Meteor.publish('MyOrders', function(userId){
  return MyOrders.find({user: userId});
});

Meteor.publish('OrdersNumbers', function(placeId){
  return OrdersNumbers.find({_id: placeId});
});

Meteor.publish('Lines', function(placeId){
  return Lines.find({place: placeId, $or:[{user: this.userId}, {waiter: this.userId}]});
});

Meteor.publish('Options', function(placeId){
  return Options.find({places: placeId});
});

Meteor.publish('Payments', function(placeId){
  return Payments.find({places: placeId});
});

Meteor.publish('Notes', function(placeId){
  return Notes.find({place: placeId});
});

Meteor.publish('MyNotes', function(userId){
  return Notes.find({user: userId});
});

Meteor.publish('LoyaltyCards', function(placeId){
  return LoyaltyCards.find({place: placeId});
});

Meteor.publish('MyLoyaltyCards', function(userId){
  return LoyaltyCards.find({user: userId});
});


Meteor.publish('PlaceWaiters', function (placeId) {
  var self = this;
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
  // var result = [];
  _.each(place.waiter, function(waiterId) {
    var user = Meteor.users.findOne({_id: waiterId});
    if (user) {
      var waiterInfo = {'name': user.profile.name, 'mail':  contactEmail(user)};
      self.added( "PlaceWaiters", waiterId, waiterInfo);
    }
  });
  // return result;
  self.ready();
});
