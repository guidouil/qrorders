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
    if (inputName != '' && (!user.profile || user.profile.name !== inputName)) {
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': inputName}});
      growl('OK', 'Profil mis à jours', 'success');
    };
  }
});

Template.profile.helpers({
  user: function () {
    //console.log(Meteor.user());
    return Meteor.user();
  }
});