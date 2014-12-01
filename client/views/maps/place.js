Template.placeMap.rendered = function () {

  var tmpl = this;
  var placeId = Router.current().params._id;
  if (!placeId) {
    placeId = Session.get('placeId');
  }
  var place = Places.findOne({_id: placeId});
  if (place && place.town) {
    var searchInput = place.street + ' ' + place.zip + ' ' + place.town;
  }

  VazcoMaps.init({}, function() {

    tmpl.mapEngine = VazcoMaps.gMaps();


    tmpl.newMap = new tmpl.mapEngine({
      div: '#map-canvas',
      lat: 49.17682,
      lng: -0.35400,
      zoom: 16
    });

    tmpl.mapEngine.geocode({
      address: searchInput,
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          if (place && Router.current().lookupTemplate() === 'EditPlace') {
            Places.update({_id: placeId},{$set: {loc: { "type": "Point", "coordinates": [latlng.lat(), latlng.lng()] } } });
          }
          tmpl.newMap.setCenter(latlng.lat(), latlng.lng());
          tmpl.newMap.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng(),
            draggable: true,
            dragend: function() {
              var point = this.getPosition();
              tmpl.mapEngine.geocode({location: point, callback: function(results) {
                searchInput.val(results[0].formatted_address);
                tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              }});
            }
          });
          // searchInput.val(results[0].formatted_address);
        } else {
          console.log(status);
        }
      }
    });

  });

};
