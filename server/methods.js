Meteor.methods({
  user_profile_name: function () {
    var user = Meteor.user();
    if (user && user.username !== undefined && user.profile.name === undefined) {
      var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
    }
  },
  user_set_owner: function () {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['owner']);
    };
  },
  user_set_waiter: function (placeId) {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['waiter']);
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.place': placeId}});
    };
  },
  delete_order: function(orderId) {
    check(orderId, String);
    var localOrder = Orders.findOne({_id: orderId});
    if ( _.contains(localOrder.waiter, Meteor.userId()) || (localOrder.user == Meteor.userId() && localOrder.status <= 1) ) {
      Lines.remove({order: localOrder._id});
      Orders.remove({_id: localOrder._id});
      // console.log(localOrder, 'Deleted');
      return true;
    } else {
      // console.log(localOrder, 'Not Deleted');
      return false;
    };
  },
  onlineUsersCount: function() {
    return Meteor.users.find({ "status.online": true }).count();
  }
});