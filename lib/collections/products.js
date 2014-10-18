Products = new Meteor.Collection("products");

Products.allow({
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

Products.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

Tags.TagsMixin(Products);

Products.allowTags(function (userId) {
    // only allow if user is logged in
    return !!userId;
});

var Schemas = {};
Schemas.Products = new SimpleSchema({
  name: {
    type: String,
    label: "Nom",
    max: 250
  },
  price: {
    type: String,
    label: "Prix",
    max: 100
  },
  place: {
    type: String,
    label: "Place"
  },
  owner: {
    type: [String],
    label: "owner"
  },
  desc: {
    type: String,
    label: "Description",
    optional: true
  },
  tags: {
    type: [String],
    label: "tags",
    optional: true
  }
});

Products.attachSchema(Schemas.Products);