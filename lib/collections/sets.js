Sets = new Meteor.Collection("sets");

Sets.allow({
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

Sets.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owners');
  },
  fetch: ['owners']
});

Tags.TagsMixin(Sets);

Sets.allowTags(function (userId) {
    // only allow if user is logged in
    return !!userId;
});

var Schemas = {};
Schemas.Sets = new SimpleSchema({
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
  products: {
    type: [String],
    label: 'Products'
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
  SetsTags: {
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

Sets.attachSchema(Schemas.Sets);

GroundDB(Sets);
