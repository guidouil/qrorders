Template.formProduct.rendered = function () {
  $('#inputTags').selectize({
      delimiter: ',',
      persist: false,
      create: function(input) {
          return {
              value: input,
              text: input
          }
      }
  });
};