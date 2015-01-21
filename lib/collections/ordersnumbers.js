OrdersNumbers = new Meteor.Collection("ordersnumbers");

Ground.Collection(OrdersNumbers);

OrdersNumbers.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if (_.contains(fields, 'seq')) {
      return true;
    };
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});

OrdersNumbers.deny({
  update: function (userId, doc, fields, modifier) {
    return false;
  }
});
