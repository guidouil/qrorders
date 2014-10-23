Template.productsPlace.helpers({
  products: function () {
    return Products.find().fetch();
  },
  place_id: function () {
    return Router.current().params._id;
  }
});