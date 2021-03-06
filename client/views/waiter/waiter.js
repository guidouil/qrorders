Template.waiter.rendered = function () {
  var placeId = Router.current().params._id;
  var place = Places.findOne({_id: placeId});
  if (place && !_.contains(place.waiter, Meteor.userId())) {
    Router.go('home');
  }
};
