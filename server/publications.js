Meteor.publish('Places', function () {
  return Places.find({});
});

Meteor.publish('Products', function(placeId){
  return Products.find({place: placeId});
});

Meteor.publish('Product', function(productId){
  return Products.find({_id: productId});
});