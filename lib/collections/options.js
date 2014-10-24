Options = new Meteor.Collection("options");

Options.allow({
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

Options.deny({
  update: function (userId, doc, fields, modifier) {
    return ( _.contains(fields, 'owners') || _.contains(fields, 'places') );
  },
  fetch: ['owners','places']
});

Tags.TagsMixin(Options);

Options.allowTags(function (userId) {
    // only allow if user is logged in
    return !!userId;
});

var Schemas = {};
Schemas.Options = new SimpleSchema({
  products: {
    type: [String],
    label: 'Products',
    optional: true
  },
  places: {
    type: [String],
    label: 'Places'
  },
  owners: {
    type: [String],
    label: 'Owners'
  },
  title: {
    type: String,
    label: 'Title'
  },
  type: {
    type: String,
    label: 'Type'
  },
  choices: {
    type: [String],
    label: 'Choices'
  }
});

Options.attachSchema(Schemas.Options);