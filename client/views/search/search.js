Template.search.helpers({
  places: function () {
    var searched = decodeURI(Router.current().params.searched);
    console.log(searched);
    if (searched === 'undefined') {
      var here = Session.get('here');
      console.log(here);

      if (here) {
        console.log('yaya');
        return Places.find({loc: {$near:{$geometry:{ type:"Point", coordinates:[here.lon, here.lat]}}, $maxDistance: 2000}});
      }
    } else {
      return Places.find({$or: [{placename: { $regex: searched, $options: 'i' }}, {phone: { $regex: searched, $options: 'i' }}, {street: { $regex: searched, $options: 'i' }}, {town: { $regex: searched, $options: 'i' }}, {zip: { $regex: searched, $options: 'i' }}, {placedesc: { $regex: searched, $options: 'i' }}, {PlacesTags: { $regex: searched, $options: 'i' }}, {code: { $regex: searched, $options: 'i' }}]}).fetch();
    }
  }
});
