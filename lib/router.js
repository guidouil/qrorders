Router.configure({
  layoutTemplate: 'layout'
});

var mustBeSignedIn = function(pause) {
    AccountsEntry.signInRequired(this);
};

Router.onBeforeAction(mustBeSignedIn, {
    except: ['entrySignIn', 'entrySignUp', 'entryForgotPassword', 'entryResetPassword', 'entryError', 'layout', 'token', 'home', 'resto', 'createPlace']
});

Router.map( function () {
  this.route('home', {
    path: '/'
  });
  this.route('cart', {
    path: '/cart',
    onBeforeAction: function () {
      Meteor.subscribe('MyOrders', Meteor.userId());
    }
  });
  this.route('search', {
    path: '/search'
  });
  this.route('profile', {
    path: '/profile'
  });
  this.route('waiter', {
    path: '/waiter/:_id',
    onBeforeAction: function() {
      Meteor.subscribe('Orders', this.params._id);
    },
    data: function() {
      return Places.findOne({_id: this.params._id});
    }
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
  this.route('editPlace', {
    path: '/edit/:_id',
    data: function() {
      return Places.findOne({_id: this.params._id});
    }
  });
  this.route('productsPlace', {
    path: '/products/:_id',
    onBeforeAction: function() {
      Meteor.subscribe('Products', this.params._id);
    },
    data: function() {
      return Places.findOne({_id: this.params._id});
    }
  });
  this.route('createProduct', {
    path: '/createproduct/:_id',
    onBeforeAction: function() {
      Meteor.subscribe('Products', this.params._id);
      Meteor.subscribe('Options', this.params._id);
    },
    data: function() {
      return Places.findOne({_id: this.params._id});

    }
  });
  this.route('editProduct', {
    path: '/editproduct/:place_id/:product_id',
    onBeforeAction: function() {
      Meteor.subscribe('Products', this.params.place_id);
      Meteor.subscribe('Options', this.params.place_id);
    },
    data: function() {
      return Products.findOne({_id: this.params.product_id});
    }
  });

  this.route('createOrder', {
    path: '/createorder/:place_id',
    onBeforeAction: function() {
      Meteor.subscribe('Products', this.params.place_id);
      Meteor.subscribe('Orders', this.params.place_id);
      Meteor.subscribe('OrdersNumbers', this.params.place_id);
      Meteor.subscribe('Lines', this.params.place_id);
      Meteor.subscribe('Options', this.params.place_id);
    },
    data: function() {
      return Places.findOne({_id: this.params.place_id});
    }
  });
  this.route('editOrder', {
    path: '/editorder/:place_id/:order_id',
    onBeforeAction: function() {
      Meteor.subscribe('Products', this.params.place_id);
      Meteor.subscribe('Orders', this.params.place_id);
      Meteor.subscribe('Lines', this.params.place_id);
      Meteor.subscribe('Options', this.params.place_id);
    },
    data: function() {
      return Places.findOne({_id: this.params.place_id});
    }
  });

  this.route('optionsPlace', {
    path: '/options/:_id',
    onBeforeAction: function() {
      Meteor.subscribe('Options', this.params._id);
    },
    data: function() {
      return Places.findOne({_id: this.params._id});
    }
  });
  this.route('createOption', {
    path: '/createoption/:_id',
    data: function() {
      return Places.findOne({_id: this.params._id});
    }
  });
  this.route('editOption', {
    path: '/editoption/:place_id/:option_id',
    onBeforeAction: function() {
      Meteor.subscribe('Options', this.params.place_id);
    },
    data: function() {
      return Options.findOne({_id: this.params.option_id});
    }
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