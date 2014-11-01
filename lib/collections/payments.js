Payments = new Meteor.Collection("payments");

Payments.allow({
  insert: function (userId, doc) {
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && doc.owner === userId);
  },
  remove: function (userId, doc) {
    return false;
  },
  fetch: ['owner']
});

Payments.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

var Schemas = {};
Schemas.Payments = new SimpleSchema({
  date: {
    type: Number,
    label: "date"
  },
  cash: {
    type: Number,
    decimal: true,
    label: "cash",
    optional: true
  },
  ticket: {
    type: Number,
    decimal: true,
    label: "ticket",
    optional: true
  },
  cashBack: {
    type: Number,
    decimal: true,
    label: "cashBack",
    optional: true
  },
  creditNote: {
    type: Number,
    decimal: true,
    label: "creditNote",
    optional: true
  },
  card: {
    type: Boolean,
    label: "card",
    optional: true
  },
  place: {
    type: String,
    label: "Place"
  },
  owner: {
    type: String,
    label: "owner"
  },
  order: {
    type: String,
    label: "Order"
  },
  total: {
    type: Number,
    decimal: true,
    label: "total"
  },
  user: {
    type: String,
    label: "user"
  }
});

Payments.attachSchema(Schemas.Payments);
