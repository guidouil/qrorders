Router.configure({
  layoutTemplate: 'layout'
});

Router.map( function () {
  this.route('home', {
    path: '/'
  });
  this.route('cart', {
    path: '/cart'
  });
  this.route('search', {
    path: '/search'
  });
  this.route('waiter', {
    path: '/waiter'
  });
  this.route('owner', {
    path: '/owner'
  });
  this.route('resto', {
    path: '/resto'
  });
  this.route('createPlace', {
    path: '/create'
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