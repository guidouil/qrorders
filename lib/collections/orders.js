Orders = new Meteor.Collection("orders");

Orders.allow({
  insert: function (userId, doc) {
    return (userId && ( _.contains(doc.waiter, userId) || doc.user == userId ));
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && ( _.contains(doc.waiter, userId) || doc.user == userId ));
  },
  remove: function (userId, doc) {
    return (userId && ( _.contains(doc.waiter, userId) || doc.user == userId ));
  },
  fetch: ['waiter','user']
});

Orders.deny({
  update: function (userId, doc, fields, modifier) {
    return ( _.contains(fields, 'waiter') || _.contains(fields, 'user') );
  },
  fetch: ['waiter','user']
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
    decimal: true,
    label: 'Total'
  },
  rebate:{
    type: Number,
    decimal: true,
    label: 'Rebate',
    optional: true
  },
  created: {
    type: Number,
    label: 'Date'
  },
  updated: {
    type: Number,
    label: 'Date',
    optional: true
  },
  wanted: {
    type: String,
    label: 'timeWanted',
    optional: true
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
  },
  chats: {
    type: [Object],
    label: "chats",
    optional: true,
    blackbox: true
  },
  notifyWaiter: {
    type: Boolean,
    label: 'notifyWaiter',
    optional: true
  },
  notifyUser: {
    type: Boolean,
    label: 'notifyUser',
    optional: true
  },
  paid: {
    type: Boolean,
    label: 'paid'
  }
});

Orders.attachSchema(Schemas.Orders);

Ground.Collection(Orders);
