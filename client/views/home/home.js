Template.home.helpers({
  places: function () {
    return Places.find().fetch();
  }
});

Template.home.events({
  'click .goup': function() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  }
});
