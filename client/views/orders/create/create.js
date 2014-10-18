Template.createOrder.helpers({
  products: function () {
    return Products.find().fetch();
  }
});