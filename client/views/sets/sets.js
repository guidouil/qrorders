Template.setsPlace.helpers({
  sets: function () {
    return Sets.find().fetch();
  },
  place_id: function () {
    return Router.current().params._id;
  }
});