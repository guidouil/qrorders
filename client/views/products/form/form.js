Template.formProduct.rendered = function () {
  $('#inputTags').selectize({
    delimiter: ',',
    persist: false,
    create: function(input) {
      return {
        value: input,
        text: input
      }
    },
    onItemRemove: function(value) {
      if (Router.current().path.search('editproduct/') == 1) {
        var productId = Router.current().params.product_id;
        Products.removeTag(value, 'Products', {_id: productId});
      };
    }
  });
};

Template.formProduct.helpers({
  name: function () {
    var currentRoute = Router.current()
    if (currentRoute.lookupTemplate() === 'createProduct') {
      return '';
    };
  }
});