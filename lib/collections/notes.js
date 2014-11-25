Notes = new Meteor.Collection('notes');
MyNotes = Notes;

Notes.allow({
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

Notes.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});

var Schemas = {};
Schemas.Notes = new SimpleSchema({
  created: {
    type: Number,
    label: "date"
  },
  updated: {
    type: Number,
    label: 'Date',
    optional: true
  },
  amount: {
    type: Number,
    decimal: true,
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

Notes.attachSchema(Schemas.Notes);

GroundDB(Notes);
