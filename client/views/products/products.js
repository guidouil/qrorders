Template.productsPlace.helpers({
  products: function () {
    return Products.find({place: this._id}).fetch();
  },
  place_id: function () {
    return Router.current().params._id;
  }
});