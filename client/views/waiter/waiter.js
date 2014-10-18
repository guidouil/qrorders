Template.waiter.helpers({
  place: function () {
    return Places.findOne({waiter: Meteor.userId()},{fields: {_id: 1}});
  }
});