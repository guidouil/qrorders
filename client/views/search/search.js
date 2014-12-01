Template.search.helpers({
  places: function () {
    var searched = decodeURI(Router.current().params.searched);
    if (searched === 'geolocation') {
      var here = Session.get('here');
      if (here) {
        return Places.find({"loc.coordinates": {$near:[here.lon,here.lat]}});
      }
    } else {
      return Places.find({$or: [{placename: { $regex: searched, $options: 'i' }}, {phone: { $regex: searched, $options: 'i' }}, {street: { $regex: searched, $options: 'i' }}, {town: { $regex: searched, $options: 'i' }}, {zip: { $regex: searched, $options: 'i' }}, {placedesc: { $regex: searched, $options: 'i' }}, {PlacesTags: { $regex: searched, $options: 'i' }}, {code: { $regex: searched, $options: 'i' }}]}).fetch();
    }
  }
});
