Lines = new Meteor.Collection("lines");

Ground.Collection(Lines);

Lines.allow({
  insert: function (userId, doc) {
    return (userId && (doc.waiter == userId || doc.user == userId));
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && (doc.waiter == userId || doc.user == userId));
  },
  remove: function (userId, doc) {
    return (userId && (doc.waiter == userId || doc.user == userId));
  },
  fetch: ['waiter','user']
});

Lines.deny({
  update: function (userId, doc, fields, modifier) {
    return ( _.contains(fields, 'waiter') || _.contains(fields, 'user') );
  },
  fetch: ['waiter','user']
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
    type: [String],
    label: 'waiter'
  },
  productId: {
    type: String,
    label: 'productId',
    optional: true
  },
  productName: {
    type: String,
    label: 'productName',
    optional: true
  },
  setId: {
    type: String,
    label: 'setId',
    optional: true
  },
  setName: {
    type: String,
    label: 'setName',
    optional: true
  },
  quantity: {
    type: Number,
    label: 'quantity'
  },
  options: {
    type: String,
    label: 'options',
    optional: true
  },
  price: {
    type: Number,
    decimal: true,
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
