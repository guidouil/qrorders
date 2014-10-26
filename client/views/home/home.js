Template.home.helpers({
  places: function () {
    return Places.find().fetch();
  }
});

Template.home.events({
  'click .search': function (evt,tmpl) {
    evt.preventDefault();
    var searchQuery = tmpl.find('.search-query').value.trim();
    if (searchQuery != '') {
      Router.go('/search/'+encodeURI(searchQuery));
    };
  }
});