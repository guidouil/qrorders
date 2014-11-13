Template.imageModal.rendered = function() {
  var $modal = $("#imageModal"),
    $image = $modal.find(".bootstrap-modal-cropper img"),
    originalData = {width:460};

  $modal.on("shown.bs.modal", function() {
    $image.cropper({
      aspectRatio: 1.618, // Nombre d'or
      data: originalData,
      done: function(data) {

      }
    });
  }).on("hidden.bs.modal", function() {
    originalData = $image.cropper("getDataURL");
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'EditPlace') {
      var placeId = currentRoute.params._id;
      Places.update({_id: placeId}, {$set: {image: originalData}});
    }
    if (currentRoute.lookupTemplate() === 'EditProduct') {
      var productId = currentRoute.params.product_id;
      Products.update({_id: productId}, {$set: {image: originalData}});
    }
    if (currentRoute.lookupTemplate() === 'EditSet') {
      var setId = currentRoute.params.set_id;
      Sets.update({_id: setId}, {$set: {image: originalData}});
    }
    console.log(currentRoute.lookupTemplate());
    $image.cropper("destroy");
  });
};
