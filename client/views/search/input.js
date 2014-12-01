Template.searchInput.helpers({
  searched: function () {
    return decodeURI(Router.current().params.searched);
  }
});

Template.searchInput.events({
  'click .search': function (evt,tmpl) {
    evt.preventDefault();
    var searchQuery = tmpl.find('.search-query').value.trim();
    if (searchQuery !== '') {
      Router.go('/search/'+encodeURI(searchQuery));
    }
  },
  'click .locate': function (evt, tmpl) {
    evt.preventDefault();
    if (Geolocation.currentLocation()) {
      Session.set('here', Geolocation.latLng());
      Router.go('/search/geolocation');
    }
  }
});
