Template.formProduct.rendered = function () {
  Meteor.call('getTags', 'Products', function (error, result) {
    if (!result || result.length == 0) {
      result = [];
    };
    $('#inputTags').selectize({
      valueField: 'name',
      labelField: 'name',
      searchField: ['name'],
      delimiter: ',',
      persist: true,
      create: function(input) {
        return {
          value: input,
          text: input
        }
      },
      options: result,
      onItemRemove: function(value) {
        var currentRoute = Router.current()
        if (currentRoute.path.search('editproduct/') == 1) {
          var productId = currentRoute.params.product_id;
          Products.removeTag(value, 'Products', {_id: productId});
        };
      }
    });
  });
};

Template.formProduct.helpers({
  options: function () {
    return Options.find().fetch();
  },
  isCheckedOption: function (optionId) {
    var currentRoute = Router.current()
    var productId = currentRoute.params.product_id;
    if (Options.findOne({_id: optionId, products: productId})) {
      return 'checked';
    };
  }
});