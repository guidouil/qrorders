Orders = new Meteor.Collection("orders");

Orders.allow({
  insert: function (userId, doc) {
    return (userId && _.contains(doc.owner, userId));
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && _.contains(doc.owner, userId));
  },
  remove: function (userId, doc) {
    return (userId && _.contains(doc.owner, userId));
  },
  fetch: ['owner']
});

Orders.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

var Schemas = {};
Schemas.Orders = new SimpleSchema({
  total:{
    type: String,
    label: 'Total'
  },
  created: {
    type: Date,
    label: 'Date'
  },
  place: {
    type: String,
    label: 'Place'
  },
  waiter: {
    type: String,
    label: 'Waiter'
  }
});