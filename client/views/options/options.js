Template.optionsPlace.helpers({
  options: function () {
    return Options.find().fetch();
  },
  place_id: function () {
    return Router.current().params._id;
  },
  stringChoices: function (choices) {
    return choices.toString();
  }
});