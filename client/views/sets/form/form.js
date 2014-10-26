Template.formSet.rendered = function () {
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
      var currentRoute = Router.current()
      if (currentRoute.path.search('editproduct/') == 1) {
        var setId = currentRoute.params.set_id;
        Sets.removeTag(value, 'Sets', {_id: setId});
      };
    }
  });
};

Template.formSet.helpers({
  products: function () {
    return Products.find().fetch();
  },
  isCheckedProduct: function (productId) {
    var currentRoute = Router.current()
    var setId = currentRoute.params.set_id;
    if (Sets.findOne({_id: setId, products: productId})) {
      return 'checked';
    };
  }
});