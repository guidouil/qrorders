Template.formProduct.rendered = function () {
  $('#inputTypes').selectize({
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