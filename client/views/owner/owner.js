Template.owner.helpers({
  myPlaces: function () {
    return Places.find({owner: Meteor.userId()}).fetch();
  }
});