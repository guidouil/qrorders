Template.onePlace.helpers({
  isOwner: function () {
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'owner') {
      return true;
    } else {
      return false;
    };
  }
});