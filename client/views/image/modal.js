Template.imageModal.helpers({
  imageTemp: function() {
    return Session.get("imageTemp");
  }
});

Template.imageModal.events({
  'click .left': function (evt,tmpl) {
    $('.modalImg').cropper('rotate', -90);
  },
  'click .right': function (evt,tmpl) {
    $('.modalImg').cropper('rotate', 90);
  },
  'shown.bs.modal': function (evt,tmpl) {
    console.log('yaya');
    var originalData = {width: 1024};
    $('.modalImg').cropper({
      aspectRatio: 1.618, // Nombre d'or
      maxWidth: 2048,
      data: originalData
    });
    console.log('yaya2');
  },
  'hidden.bs.modal': function() {

    var originalData = $('.modalImg').cropper("getDataURL", "image/jpeg", 0.6);
    // console.log(originalData);
    if (originalData !== '') {
      var imageId = Images.insert({data: originalData});

      var currentRoute = Router.current();
      if (currentRoute.lookupTemplate() === 'EditPlace') {
        var placeId = currentRoute.params._id;
        var place = Places.findOne({_id: placeId});
        if (place.image ) {
          Meteor.call('delete_image', place.image);
        }
        Places.update({_id: placeId}, {$set: {image: imageId}});
      }
      if (currentRoute.lookupTemplate() === 'EditProduct') {
        var productId = currentRoute.params.product_id;
        var product = Products.findOne({_id: productId});
        if (product.image ) {
          Meteor.call('delete_image', product.image);
        }
        Products.update({_id: productId}, {$set: {image: imageId}});
      }
      if (currentRoute.lookupTemplate() === 'EditSet') {
        var setId = currentRoute.params.set_id;
        var set = Sets.findOne({_id: setId});
        if (set.image ) {
          Meteor.call('delete_image', set.image);
        }
        Sets.update({_id: setId}, {$set: {image: imageId}});
      }
    }
    Session.set('imageTemp', '');
    $('.modalImg').cropper("destroy");
  }
});
