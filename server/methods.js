Meteor.methods({
  user_profile_name: function () {
    var user = Meteor.user();
    if(user && user.username !== undefined && user.profile.name === undefined) {
      var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
      Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.name': name}});
    }
  },
  user_set_owner: function() {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['owner']);
    };
  },
  user_set_waiter: function() {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['waiter']);
    };
  }
});