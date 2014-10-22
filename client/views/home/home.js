Template.home.helpers({
  places: function () {
    return Places.find().fetch();
  }
});