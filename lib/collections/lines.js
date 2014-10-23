Lines = new Meteor.Collection("lines");

Lines.allow({
  insert: function (userId, doc) {
    return (userId && doc.waiter == userId);
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && doc.waiter == userId);
  },
  remove: function (userId, doc) {
    return (userId && doc.waiter == userId);
  },
  fetch: ['waiter']
});

Lines.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'waiter');
  },
  fetch: ['waiter']
});

var Schemas = {};
Schemas.Lines = new SimpleSchema({
  order: {
    type: String,
    label: 'Commande'
  },
  place: {
    type: String,
    label: 'Place'
  },
  waiter: {
    type: String,
    label: 'waiter'
  },
  productId: {
    type: String,
    label: 'productId'
  },
  productName: {
    type: String,
    label: 'productName'
  },
  quantity: {
    type: Number,
    label: 'quantity'
  },
  options: {
    type: [String],
    label: 'options',
    optional: true
  },
  price: {
    type: Number,
    label: 'subTotal'
  },
  created: {
    type: Number,
    label: 'created'
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

Lines.attachSchema(Schemas.Lines);