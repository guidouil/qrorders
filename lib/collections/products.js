Products = new Meteor.Collection("products");

Products.allow({
  insert: function (userId, doc) {
    return (userId && _.contains(doc.owners, userId));
  },
  update: function (userId, doc, fields, modifier) {
    return (userId && _.contains(doc.owners, userId));
  },
  remove: function (userId, doc) {
    return (userId && _.contains(doc.owners, userId));
  },
  fetch: ['owners']
});

Products.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owners');
  },
  fetch: ['owners']
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
    type: Number,
    decimal: true,
    label: "Prix"
  },
  places: {
    type: [String],
    label: "Place"
  },
  owners: {
    type: [String],
    label: "owner"
  },
  desc: {
    type: String,
    label: "Description",
    optional: true
  },
  image: {
    type: String,
    label: "image",
    optional: true
  },
  imageTmp: {
    type: String,
    label: "imageTmp",
    optional: true
  },
  ProductsTags: {
    type: [String],
    label: "tags",
    optional: true
  },
  options: {
    type: [String],
    label: "options",
    optional: true
  },
  tagGroups: {
    type: [String],
    label: "tagGroups",
    optional: true
  }
});

Products.attachSchema(Schemas.Products);

Ground.Collection(Products);
