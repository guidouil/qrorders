Lines = new Meteor.Collection("lines");

Lines.allow({
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

Lines.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

var Schemas = {};
Schemas.Lines = new SimpleSchema({
  order: {
    type: String,
    label: 'Commande'
  },
  product: {
    type: String,
    label: 'product'
  },
  quantity: {
    type: Number,
    label: 'quantity'
  },
  options: {
    type: [String],
    label: 'options'
  },
  total: {
    type: Number,
    label: 'total'
  }
});