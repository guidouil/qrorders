Template.createProduct.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputPrice = tmpl.find('#inputPrice').value;
    var inputDesc = tmpl.find('#inputDesc').value.trim();
    var inputTags = tmpl.find('#inputTags').value.split(',');
    if (inputName != '' && inputPrice != '') {
      inputPrice = parseFloat(inputPrice).toFixed(2);
      var productId = Products.insert({
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        places: [this._id],
        owners: [Meteor.userId()]
      });
      if (inputTags.length > 0) {
        $.each(inputTags, function(index, value) {
          if (value != '') {
            Products.addTag(value, 'Products', {_id: productId});
          };
        });
      };
      swal("Cool !", "Vous avez ajouté un(e) "+inputName, "success");
    };
    Router.go('productsPlace', {_id: this._id});
  }
});