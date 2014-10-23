Orders = new Meteor.Collection("orders");
MyOrders = Orders;

Orders.allow({
  insert: function (userId, doc) {
    return (userId && _.contains(doc.waiter, userId));
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && _.contains(doc.waiter, userId));
  },
  remove: function (userId, doc) {
    return (userId && _.contains(doc.waiter, userId));
  },
  fetch: ['waiter']
});

Orders.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'waiter');
  },
  fetch: ['waiter']
});

var Schemas = {};
Schemas.Orders = new SimpleSchema({
  number:{
    type: Number,
    label: 'number'
  },
  name:{
    type: String,
    label: 'name'
  },
  total:{
    type: Number,
    label: 'Total'
  },
  created: {
    type: Number,
    label: 'Date'
  },
  place: {
    type: String,
    label: 'Place'
  },
  waiter: {
    type: [String],
    label: 'Waiter'
  },
  status: {
    type: Number,
    label: 'Status'
  },
  user: {
    type: String,
    label: 'user'
  }
});

Orders.attachSchema(Schemas.Orders);