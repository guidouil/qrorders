Template.onePlace.events({
  'click .placeModal': function (evt,tmpl) {
    var placeId = evt.currentTarget.attributes.id.value;
    Session.set('placeId', placeId);
    $('#placeModal').modal();
  }
});

Template.onePlace.helpers({
  isOwner: function () {
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'Owner') {
      return true;
    } else {
      return false;
    }
  }
});
