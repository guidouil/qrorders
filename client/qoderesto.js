Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.layout.rendered = function () {
  Meteor.call('user_profile_name');
};