Meteor.startup(function () {
  // Creating Admin Prod
  if (Meteor.users.findOne("4wPgiqnoDewMyEDap"))
    Roles.addUsersToRoles("4wPgiqnoDewMyEDap", ['admin']);
  // Creating Admin Dev
  if (Meteor.users.findOne("6nedcPXypfWZRBbjo"))
    Roles.addUsersToRoles("6nedcPXypfWZRBbjo", ['admin']);

  // Ensuring indexes
  if (Places.find().count() === 0) {
    Places._ensureIndex({ "loc.coordinates" : "2d" });
  }
  if (Products.find().count() === 0) {
    Products._ensureIndex({ "places": 1});
  }
  if (Sets.find().count() === 0) {
    Sets._ensureIndex({ "places": 1});
  }
  if (Orders.find().count() === 0) {
    Orders._ensureIndex({ "place": 1, "user": 1, "waiter": 1 });
  }
  if (Lines.find().count() === 0) {
    Lines._ensureIndex({ "place": 1, "user": 1, "waiter": 1 });
    Lines._ensureIndex({ "order": 1, "user": 1, "waiter": 1 });
  }
  if (Options.find().count() === 0) {
    Options._ensureIndex({ "products": 1});
  }
  if (Payments.find().count() === 0) {
    Payments._ensureIndex({ "place": 1});
  }
  if (Notes.find().count() === 0) {
    Notes._ensureIndex({ "place": 1});
  }


  //MailGun Conf
  process.env.MAIL_URL = 'smtp://postmaster%40jecmd.fr:a4a921f720e8ab89f03325dfb2a46439@smtp.mailgun.org:587';
});
