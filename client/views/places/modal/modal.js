Template.placeModal.helpers({
  place: function() {
    if (Session.get('placeId')) {
      var placeId = Session.get('placeId');
      return Places.findOne({_id: placeId});
    }
  }
});
