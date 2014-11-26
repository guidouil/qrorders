Template.navbar.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
      template === currentRoute.lookupTemplate() ? 'active' : '';
  },
  isWaiterUser: function() {
    return Roles.userIsInRole(Meteor.user(), ['waiter']);
  },
  isOwnerUser: function() {
    return Roles.userIsInRole(Meteor.user(), ['owner']);
  },
  NotifyCount: function() {
    return Orders.find({notify: true}).count();
  },
  MyNotifyCount: function() {
    return MyOrders.find({notify: true}).count();
  }
});
