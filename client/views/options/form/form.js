Template.formOption.rendered = function () {
  $('#inputChoices').selectize({
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
      if (currentRoute.lookupTemplate() === 'editOption') {
        var optionId = currentRoute.params.option_id;
        Options.removeTag(value, 'Options', {_id: optionId});
      };
    }
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