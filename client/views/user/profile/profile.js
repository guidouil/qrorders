Template.profile.events({
  'click .logout': function (evt, tmpl) {
    evt.preventDefault();
    Meteor.logout();
    Router.go('home');
  },
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var user = Meteor.user();
    var inputName = tmpl.find('#inputName').value.trim();
    if (inputName !== '' && (!user.profile || user.profile.name !== inputName)) {
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': inputName}});
      growl('OK', 'Nom mis à jours', 'success');
    }
    var inputMail = tmpl.find('#inputMail').value.trim();
    if (inputMail !== '' && inputMail !== user.emails[0].address) {
      Meteor.call('update_email', inputMail);
      growl('OK', 'Adresse mail mise à jours', 'success');
    }

    if (tmpl.find('#selectplace')) {
      var selectplace = tmpl.find('#selectplace').value.trim();
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.place': selectplace}});
      growl('OK', 'Resto mise à jours', 'success');
    }
  }
});

Template.profile.helpers({
  user: function () {
    return Meteor.user();
  },
  isWaiter: function() {
    return Roles.userIsInRole(Meteor.user(), ['waiter']);
  },
  places: function() {
    return Places.find({waiter: Meteor.userId()}).fetch();
  },
  isSelectedPlace: function (placeId) {
    var user = Meteor.user();
    if (user.profile.place === placeId) {
      return 'selected';
    } else {
      return false;
    }
  },
  notes: function () {
    return MyNotes.find().fetch();
  },
  placeName: function (placeId) {
    var place = Places.findOne({_id: placeId});
    return place.placename + ' - ' + place.town;
  }
});
