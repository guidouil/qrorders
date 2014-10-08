Meteor.methods({
  user_profile_name: function () {
    var user = Meteor.user();
    if(user && user.username !== undefined && user.profile.name === undefined) {
      var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
      Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.name': name}});
    }
  }
});