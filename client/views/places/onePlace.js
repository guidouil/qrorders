Template.onePlace.events({
  'click .placeModal': function (evt,tmpl) {
    var placeId = evt.currentTarget.attributes.id.value;
    Session.set('placeId', placeId);
    $('#placeModal').modal();
  },
  'click .createOrder': function (evt, tmpl) {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }
});

Template.onePlace.helpers({
  isOwner: function () {
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'Owner' || currentRoute.lookupTemplate() === 'adminPlaces') {
      return true;
    } else {
      return false;
    }
  }
});
