Template.createProduct.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputPrice = tmpl.find('#inputPrice').value;
    var inputDesc = tmpl.find('#inputDesc').value.trim();
    var inputTags = tmpl.find('#inputTags').value.split(',');
    var inputOptions = [];
    if ($('.inputOptions:checked')) {
      $('.inputOptions:checked').each(function(){
        inputOptions.push(this.id);
      });
    }
    if (inputName !== '' && inputPrice !== '') {
      inputPrice = parseFloat(inputPrice).toFixed(2);
      var productId = Products.insert({
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        places: [this._id],
        owners: [Meteor.userId()],
        options: inputOptions
      });
      if (inputOptions.length > 0) {
        $('.inputOptions:checkbox').each(function(){
          Options.update({_id: this.id}, {$pull: {products: productId}});
        });
        $.each(inputOptions, function(index, optionId) {
           Options.update({_id: optionId}, {$push: {products: productId}});
        });
      }
      if (inputTags.length > 0) {
        $.each(inputTags, function(index, value) {
          if (value !== '') {
            Products.addTag(value, 'Products', {_id: productId});
          }
        });
      }
      swal("Cool !", "Vous avez ajouté un(e) " + inputName, "success");
      Router.go('editProduct', {place_id: this._id, product_id: productId});
    }
  }
});
