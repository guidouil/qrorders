LoyaltyCards = new Meteor.Collection('loyaltycards');
MyLoyaltyCards = LoyaltyCards;

LoyaltyCards.allow({
  insert: function (userId, doc) {
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && doc.owner === userId);
  },
  remove: function (userId, doc) {
    return (userId && doc.owner === userId);
  },
  fetch: ['owner']
});

LoyaltyCards.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

var Schemas = {};
Schemas.LoyaltyCards = new SimpleSchema({
  created: {
    type: Number,
    label: "date"
  },
  updated: {
    type: Number,
    label: 'Date',
    optional: true
  },
  points: {
    type: Number,
    label: "amount"
  },
  place: {
    type: String,
    label: "Place"
  },
  owner: {
    type: String,
    label: "owner"
  },
  user: {
    type: String,
    label: "user"
  }
});

LoyaltyCards.attachSchema(Schemas.LoyaltyCards);
