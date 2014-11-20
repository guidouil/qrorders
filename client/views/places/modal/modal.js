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
  }
});
