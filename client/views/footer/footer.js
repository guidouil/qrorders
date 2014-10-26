Template.footer.helpers({
  year: function () {
    return moment().format('YYYY');
  },
  usersCount: function () {
    Meteor.call('onlineUsersCount', function (error, result) {
      if (result >= 1) {
        Session.set('usersCount', result);
      };
    });
    if (Session.get('usersCount') <= 1) {
      return Session.get('usersCount') + ' utilisateur connecté';
    }else if (Session.get('usersCount') >= 2) {
      return Session.get('usersCount') + ' utilisateurs connectés';
    };
  }
});