Template.placeModal.helpers({
  place: function() {
    if (Session.get('placeId')) {
      var placeId = Session.get('placeId');
      return Places.findOne({_id: placeId});
    }
  },
  isCreateOrder: function () {
    if (Router.current().lookupTemplate() === 'CreateOrder') {
      return true;
    }
    return false;
  },
  days: function () {
    var result =  [
      {day: 'Lundi', day_number: 1},
      {day: 'Mardi', day_number: 2},
      {day: 'Mercredi', day_number: 3},
      {day: 'Jeudi', day_number: 4},
      {day: 'Vendredi', day_number: 5},
      {day: 'Samedi', day_number: 6},
      {day: 'Dimanche', day_number: 7}
    ];
    return result;
  },
  showHours: function (dayNum, dayTxt) {
    if (Session.get('placeId')) {
      var placeId = Session.get('placeId');
      var place =  Places.findOne({_id: placeId});
      if (place && place.hours && place.days && place.days[dayNum]) {
        var result = '';
        var placeHours = [];
        $.each(place.hours, function(index, hour){
          placeHours[hour._id] = 'de '+hour.open+' à '+hour.close+' | ';
        });
        var addTdTr = false;
        result = '<tr class="success"><td class="text-right">'+dayTxt+'</td><td>| ';
        $.each(place.days[dayNum], function (index, hourId) {
          if (hourId === 'closed') {
            result = '<tr class="danger"><td class="text-right">'+dayTxt+'</td><td>| Fermé |</td></tr>';
          } else {
            result += placeHours[hourId];
            addTdTr = true;
          }
        });
        if (addTdTr) {
          result += '</td></tr>';
        }
        return result;
      }
    }
  }
});
