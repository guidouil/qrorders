Template.placeWaiters.helpers({
  placeWaiters: function () {
    Meteor.call('get_waiters', this._id, function (error, waiters) {
      if (waiters) {
        Session.set('waiters', waiters) ;
      }
    });
    return Session.get('waiters');
  }
});

Template.placeWaiters.events({
  'click .remove': function (evt, tmpl) {
    evt.preventDefault();
    var waiterId = evt.currentTarget.attributes.id.value;
    var placeId = Router.current().params._id;
    Meteor.call('remove_place_waiter',placeId,waiterId, function (error, result) {
      if (!error) {
        growl('OK', 'Serveur retiré', 'danger');
      }
    });
  },
  'click .addWaiter': function (evt, tmpl) {
    evt.preventDefault();
    var mail = tmpl.find('#waiterMail').value.trim();
    alert('soon '+mail);
    var placeId = Router.current().params._id;
  }
});
