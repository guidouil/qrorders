Template.imageModal.rendered = function() {
  var $modal = $("#imageModal"),
    $image = $modal.find(".bootstrap-modal-cropper img"),
    originalData = {width:460};

  $modal.on("shown.bs.modal", function() {
    $image.cropper({
      aspectRatio: 1.618, // Nombre d'or
      maxWidth: 2048,
      data: originalData,
      done: function(data) {

      }
    });
  }).on("hidden.bs.modal", function() {
    originalData = $image.cropper("getDataURL", "image/jpeg", 0.6);
    // Meteor.call('tiny_images', '', '', originalData, function(error, result){
    //   console.log(error, result);
    // });
    var defaultChunkSize = 10 * 1024 * 1024;
    var newFile = new FS.File();
    newFile.attachData(originalData, {type: 'image/png'}, function(error){
        if(error) throw error;
        newFile.name('jecmd.jpg');
        var image = Images.insert(newFile);
        // console.log(image._id);
        // Meteor.call('tiny_images', image._id);
        var currentRoute = Router.current();
        if (currentRoute.lookupTemplate() === 'EditPlace') {
          var placeId = currentRoute.params._id;
          var place = Places.findOne({_id: placeId});
          if (place.image ) {
            Meteor.call('delete_image', place.image);
          }
          Places.update({_id: placeId}, {$set: {image: image._id, imageTmp: ''}});
        }
        if (currentRoute.lookupTemplate() === 'EditProduct') {
          var productId = currentRoute.params.product_id;
          var product = Products.findOne({_id: productId});
          if (product.image ) {
            Meteor.call('delete_image', product.image);
          }
          Products.update({_id: productId}, {$set: {image: image._id, imageTmp: ''}});
        }
        if (currentRoute.lookupTemplate() === 'EditSet') {
          var setId = currentRoute.params.set_id;
          var set = Sets.findOne({_id: setId});
          if (set.image ) {
            Meteor.call('delete_image', set.image);
          }
          Sets.update({_id: setId}, {$set: {image: image._id, imageTmp: ''}});
        }
    });

    $image.cropper("destroy");
  });
};
