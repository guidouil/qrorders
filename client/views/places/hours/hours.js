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
    if (timeOpen && timeClose && timeOpen > timeClose) {
      var hourId = new Meteor.Collection.ObjectID()._str;
      Places.update({_id: placeId},
        {
          $set: {updated: Date.now()},
          $push: {hours: { _id: hourId, open: timeOpen, close: timeClose} }
        }
      );
    }
  },
  'click .remove': function (evt, tmpl) {
    var placeId = Router.current().params._id;
    var hour = this;
    Places.update({_id: placeId},{$set: {updated: Date.now()}, $pull: {'hours': hour }});
  },
  'click .save': function (evt, tmpl) {
    var placeId = Router.current().params._id;
    var previousDay = 1;
    var dayTemp = [];
    var days = [];
    var len = $('.hour:checked').length;
    $('.hour:checked').each(function(index, checked) {
      var dayHour = checked.id.split("_");
      var day = dayHour[0];
      var hourId = dayHour[1];
      if (day !== previousDay) {
        days[previousDay] = dayTemp;
        previousDay = day;
        dayTemp = [];
      }
      if (hourId === 'closed') {
        dayTemp = [];
      }
      dayTemp.push(hourId);
      if (index === len - 1) {
        days[day] = dayTemp;
      }
    });
    if (days.length > 0) {
      Places.update({_id: placeId},{$set: {updated: Date.now(), days: days}});
      Router.go('editPlace', {_id: placeId});
    }
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
  },
  isChecked: function (dayNum, hourId) {
    var placeId = Router.current().params._id;
    var place = Places.findOne({_id: placeId});
    if (place && place.days && place.days[dayNum]) {
      var found = $.inArray(hourId, place.days[dayNum]);
      if (found >= 0) {
        return 'checked';
      }
    }
    return false;
  }
});
