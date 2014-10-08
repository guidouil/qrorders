Meteor.startup(function () {
  if (Meteor.users.findOne("euuYQNWWHP89HSesg"))
    Roles.addUsersToRoles("euuYQNWWHP89HSesg", ['admin']);
});