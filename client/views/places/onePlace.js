Template.onePlace.helpers({
  isOwner: function () {
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'Owner') {
      return true;
    } else {
      return false;
    }
  }
});
