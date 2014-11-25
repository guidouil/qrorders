Template.hoursPlace.rendered = function () {
  $('.clockpicker').clockpicker({
    placement: 'bottom',
    align: 'left',
    autoclose: true
  });
};


Template.hoursPlace.events({
  'click .addHours': function (evt, tmpl) {
    var placeId = this._id;
    var timeOpen = tmpl.find('#timeOpen').value;
    var timeClose = tmpl.find('#timeClose').value;
    var hourId = new Meteor.Collection.ObjectID()._str;
    Places.update({_id: placeId},
      {
        $set: {updated: Date.now()},
        $push: {hours: { _id: hourId, open: timeOpen, close: timeClose} }
      }
    );
  },
  'click .remove': function (evt, tmpl) {
    var placeId = Router.current().params._id;
    var hour = this;
    Places.update({_id: placeId},{$set: {updated: Date.now()}, $pull: {'hours': hour }});
  }
});

Template.hoursPlace.helpers({
  days: function () {
    var placeId = Router.current().params._id;
    var place = Places.findOne({_id: placeId});
    if (place && place.hours) {
      var result =  [
        {day: 'lundi', day_number: 1, 'hours': place.hours},
        {day: 'mardi', day_number: 2, 'hours': place.hours},
        {day: 'mercredi', day_number: 3, 'hours': place.hours},
        {day: 'jeudi', day_number: 4, 'hours': place.hours},
        {day: 'vendredi', day_number: 5, 'hours': place.hours},
        {day: 'samedi', day_number: 6, 'hours': place.hours},
        {day: 'dimanche', day_number: 7, 'hours': place.hours}
        ];
      return result;
    }
  }
});
