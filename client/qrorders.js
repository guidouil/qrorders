Meteor.subscribe('Places');
Meteor.subscribe('Images');


Template.layout.rendered = function () {
  var user = Meteor.user();
  if (user && user.username !== undefined && user.profile.name === undefined) {
    var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
  }
  if (Meteor.userId()) {
    Meteor.subscribe('Orders');
    Meteor.subscribe('MyOrders');
  }
};

getUserLanguage = function () {
  // var language = window.navigator.userLanguage || window.navigator.language;
  // if (language.length > 2) {
  //   language = language.substring(0,2).toLowerCase();
  // }
  // Session.set('language', language);
  Session.set('language', 'fr');
  //return language;
};


Meteor.startup(function () {
  Accounts.ui.config({
    passwordSignupFields: 'EMAIL_ONLY'
  });

  getUserLanguage();

  AccountsEntry.config({
    homeRoute: '/',                 // mandatory - path to redirect to after sign-out
    dashboardRoute: '/profile',      // mandatory - path to redirect to after successful sign-in
    wrapLinks: true,
    passwordSignupFields: 'EMAIL_ONLY',
    language: Session.get('language'),
    showOtherLoginServices: true//,     // Set to false to hide oauth login buttons on the signin/signup pages. Useful if you are using
  });

  // Session.set("showLoadingIndicator", true);
  //
  // TAPi18n.setLanguage(Session.get('language'))
  //   .done(function () {
  //     Session.set("showLoadingIndicator", false);
  //   })
  //   .fail(function (error_message) {
  //     // Handle the situation
  //     console.log(error_message);
  //   });
});
