Template.paymentsPlace.helpers({
  payments: function () {
    if (_.contains(this.owner, Meteor.userId())) {
      return Payments.find().fetch();
    }
  }
});
