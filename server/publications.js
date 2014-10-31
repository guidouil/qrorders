Meteor.publish('Places', function () {
  return Places.find({});
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
  return Orders.find({user: userId});
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
