Template.formSet.rendered = function () {
  Meteor.call('getTags', 'Sets', function (error, result) {
    if (!result || result.length === 0) {
      result = [];
    }
    $('#inputTags').selectize({
      valueField: 'name',
      labelField: 'name',
      searchField: ['name'],
      delimiter: ',',
      persist: true,
      create: function(input) {
        return {
          name: input
        };
      },
      options: result,
      onItemRemove: function(value) {
        var currentRoute = Router.current();
        if (currentRoute.path.search('editproduct/') == 1) {
          var setId = currentRoute.params.set_id;
          Sets.removeTag(value, 'Sets', {_id: setId});
        }
      }
    });
  });
};

Template.formSet.helpers({
  products: function () {
    return Products.find().fetch();
  },
  isCheckedProduct: function (productId) {
    var currentRoute = Router.current();
    var setId = currentRoute.params.set_id;
    if (Sets.findOne({_id: setId, products: productId})) {
      return 'checked';
    }
  }
});
