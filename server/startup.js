Meteor.startup(function () {
  if (Meteor.users.findOne("WQSeovurxLMkkWmz9"))
    Roles.addUsersToRoles("WQSeovurxLMkkWmz9", ['admin']);
});