Template.search.helpers({
  searched: function () {
    return decodeURI(Router.current().params.searched);
  },
  places: function () {
    var searched = decodeURI(Router.current().params.searched);
    return Places.find({$or: [{placename: { $regex: searched, $options: 'i' }}, {phone: { $regex: searched, $options: 'i' }}, {street: { $regex: searched, $options: 'i' }}, {town: { $regex: searched, $options: 'i' }}, {zip: { $regex: searched, $options: 'i' }}, {placedesc: { $regex: searched, $options: 'i' }}, {PlacesTags: { $regex: searched, $options: 'i' }}, {code: { $regex: searched, $options: 'i' }}]}).fetch();
  }
});

Template.search.events({
  'click .search': function (evt,tmpl) {
    evt.preventDefault();
    var searchQuery = tmpl.find('.search-query').value.trim();
    if (searchQuery !== '') {
      Router.go('/search/'+encodeURI(searchQuery));
    };
  }
});
