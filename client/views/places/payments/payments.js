Template.paymentsPlace.helpers({
  payments: function () {
    if (_.contains(this.owner, Meteor.userId())) {
      return Payments.find({},{sort: {date: -1}}).fetch();
    }
  },
  bigTotal: function () {
    var bigTotal = 0;
    if (_.contains(this.owner, Meteor.userId())) {
      Payments.find({}).map(function(doc) {
        bigTotal += doc.total;
      });
    }
    return bigTotal;
  }
});
