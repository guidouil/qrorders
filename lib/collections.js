Places = new Meteor.Collection("palces");

Places.allow({
  insert: function (userId, doc) {
    return (doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    return doc.owner === userId;
  },
  fetch: ['owner']
});

Places.deny({
  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'owner');
  },
  fetch: ['owner']
});