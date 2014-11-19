Template.formOption.rendered = function () {
  Meteor.call('getTags', 'Options', function (error, result) {
    if (!result || result.length === 0) {
      result = [];
    }
    $('#inputChoices').selectize({
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
        if (currentRoute.lookupTemplate() === 'EditOption') {
          var optionId = currentRoute.params.option_id;
          Options.removeTag(value, 'Options', {_id: optionId});
        }
      }
    });
  });
};

Template.formOption.helpers({
  isTypeRadio: function (type) {
    return ('radio' === type?'checked':false);
  },
  isTypeCheckbox: function (type) {
    return ('checkbox' === type?'checked':false);
  }
});
