Template.adminPlaces.helpers({
  // check if user is an admin
  isAdminUser: function() {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
  },
  places: function () {
    return Places.find().fetch();
  }
});
