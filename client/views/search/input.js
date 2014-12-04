Template.searchInput.helpers({
  searched: function () {
    if (Router.current().params.searched) {
      return decodeURI(Router.current().params.searched);
    }
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
    $("#geoloc").attr('src', '/ajax-loader.gif');
    Session.set('here', Geolocation.latLng());

    function loadSearch() {
      setTimeout(function () {
        Session.set('here', Geolocation.latLng());
        $("#geoloc").attr('src', '/geolocation.png');
        Router.go('/search/');
      }, 4000);
    }
    if (Session.get('here') === null) {
      loadSearch();
    } else {
      $("#geoloc").attr('src', '/geolocation.png');
      Router.go('/search/');
    }
  }
});
