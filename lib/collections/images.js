Images = new Meteor.Collection("images");

Images.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});

Images.deny({
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});


var Schemas = {};
Schemas.Images = new SimpleSchema({
  data: {
    type: String,
    label: "data"
  }
});

Images.attachSchema(Schemas.Images);

Ground.Collection(Images);
