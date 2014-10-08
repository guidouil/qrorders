Meteor.publish('Places', function () {
  return Places.find({});
});