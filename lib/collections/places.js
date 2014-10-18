Places = new Meteor.Collection("places");

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
  name: {
    type: String,
    label: "Nom",
    max: 250
  },
  phone: {
    type: String,
    label: "Téléphone",
    max: 20
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

Places.attachSchema(Schemas.Places);