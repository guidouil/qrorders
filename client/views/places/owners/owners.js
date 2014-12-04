Template.placeOwners.helpers({
  placeOwners: function () {
    Meteor.call('get_owners', this._id, function (error, owners) {
      if (owners) {
        Session.set('owners', owners) ;
      }
    });
    return Session.get('owners');
  }
});

Template.placeOwners.events({
  'click .removeOwner': function (evt, tmpl) {
    evt.preventDefault();
    var ownerId = evt.currentTarget.attributes.id.value;
    var placeId = Router.current().params._id;
    Meteor.call('remove_place_owner',placeId,ownerId, function (error, result) {
      if (result) {
        growl('OK', 'Propriétaire retiré', 'danger');
      }
    });
  },
  'click .addOwner': function (evt, tmpl) {
    evt.preventDefault();
    var mail = tmpl.find('#ownerMail').value.trim();
    var placeId = Router.current().params._id;
    Meteor.call('add_place_owner',placeId,mail, function (error, result) {
      if (result) {
        growl('OK', 'Propriétaire ajouté', 'success');
      } else {
        growl('KO', mail+' inconnu', 'danger');
      }
    });
  }
});
