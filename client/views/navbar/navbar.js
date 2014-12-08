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
    return Orders.find({notifyWaiter: true, waiter: Meteor.userId()}).count();
  },
  MyNotifyCount: function() {
    return Orders.find({notifyUser: true, user: Meteor.userId()}).count();
  }
});
