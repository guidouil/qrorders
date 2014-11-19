Template.placeWaiters.helpers({
  placeWaiters: function () {
    Meteor.call('get_waiters', this._id, function (error, waiters) {
      if (waiters) {
        console.log(waiters);
        return waiters;
      }
    });
  }
});
