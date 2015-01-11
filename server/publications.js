Meteor.publish('Places', function () {
  return Places.find({});
});

Meteor.publish('Images', function (imgId) {
  return Images.find({_id: imgId});
});

Meteor.publish('Products', function(placeId){
  return Products.find({places: placeId});
});

Meteor.publish('Sets', function(placeId){
  return Sets.find({places: placeId});
});

Meteor.publish('Orders', function(){
  if (this.userId !== undefined) {
    return Orders.find({$or:[{owner: this.userId}, {waiter: this.userId}, {user: this.userId}]});
  }
});

Meteor.publish('MyOrders', function(){
  if (this.userId !== undefined) {
    return Orders.find({user: this.userId});
  }
});

Meteor.publish('OrdersNumbers', function(placeId){
  return OrdersNumbers.find({_id: placeId});
});

Meteor.publish('Lines', function(orderId){
  return Lines.find({order: orderId, $or:[{user: this.userId}, {waiter: this.userId}]});
});

Meteor.publish('Options', function(placeId){
  return Options.find({places: placeId});
});

Meteor.publish('Payments', function(placeId){
  return Payments.find({place: placeId});
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
