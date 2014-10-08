Router.configure({
  layoutTemplate: 'layout'
});

Router.map( function () {
  this.route('home', {
    path: '/'
  });
  this.route('adminUsers', {
      path:'/users',
      template: 'adminUsers',
      onBeforeAction: function() {
          if (Meteor.loggingIn()) {
              this.render(this.loadingTemplate);
          } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
              console.log('redirecting');
              this.redirect('/');
          }
      }
  });
});