Template.onePlace.helpers({
  isOwner: function () {
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'Owner') {
      return true;
    } else {
      return false;
    }
  },
  imageSrc: function(imageId) {
    if (imageId) {
      var image = Images.findOne({_id: imageId});
      return image.name();
    }
  }
});
