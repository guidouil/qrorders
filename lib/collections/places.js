Places = new Meteor.Collection("places");
PlaceWaiters = new Meteor.Collection("placewaiters");

Places.allow({
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

Places.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

Tags.TagsMixin(Places);

Places.allowTags(function (userId) {
    // only allow if user is logged in
    return !!userId;
});

var Schemas = {};
Schemas.Places = new SimpleSchema({
  placename: {
    type: String,
    label: "Nom",
    max: 250
  },
  code: {
    type: String,
    label: "Code",
    max: 250,
    optional: true
  },
  phone: {
    type: String,
    label: "Téléphone",
    max: 20
  },
  owner: {
    type: [String],
    label: "owner"
  },
  waiter: {
    type: [String],
    label: "waiter"
  },
  created: {
    type: Number,
    label: "created"
  },
  updated: {
    type: Number,
    label: 'Date',
    optional: true
  },
  street: {
    type: String,
    label: "Adresse",
    max: 250,
    optional: true
  },
  town: {
    type: String,
    label: "Ville",
    max: 250,
    optional: true
  },
  zip: {
    type: String,
    label: "Code Postal",
    max: 10,
    optional: true
  },
  placedesc: {
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
  PlacesTags: {
    type: [String],
    label: "tags",
    optional: true
  },
  tagGroups: {
    type: [String],
    label: "tagGroups",
    optional: true
  }
});

Places.attachSchema(Schemas.Places);
