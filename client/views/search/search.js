Template.search.helpers({
  searched: function () {
    return decodeURI(Router.current().params.query);
  },
  places: function () {
    var query = decodeURI(Router.current().params.query);
    return Places.find({$or: [{placename: { $regex: query, $options: 'i' }}, {phone: { $regex: query, $options: 'i' }}, {street: { $regex: query, $options: 'i' }}, {town: { $regex: query, $options: 'i' }}, {zip: { $regex: query, $options: 'i' }}, {desc: { $regex: query, $options: 'i' }}, {tags: { $regex: query, $options: 'i' }}]}).fetch();
  }
});

Template.search.events({
  'click .search': function (evt,tmpl) {
    evt.preventDefault();
    var searchQuery = tmpl.find('.search-query').value.trim();
    if (searchQuery != '') {
      Router.go('/search/'+encodeURI(searchQuery));
    };
  }
});