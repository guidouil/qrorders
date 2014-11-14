Template.productModal.helpers({
  product: function() {
    if (Session.get('productId')) {
      var productId = Session.get('productId');
      return Products.findOne({_id: productId});
    }
    if (Session.get('setId')) {
      var setId = Session.get('setId');
      return Sets.findOne({_id: setId});
    }
  },
  addClass: function () {
    if (Session.get('productId')) {
      return 'addProduct';
    }
    if (Session.get('setId')) {
      return 'addSet';
    }
  }
});
