Template.editProduct.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputPrice = tmpl.find('#inputPrice').value;
    var inputDesc = tmpl.find('#inputDesc').value.trim();
    var inputTags = tmpl.find('#inputTags').value.split(',');
    if (inputName != '' && inputPrice != '') {
      var productId = Router.current().params.product_id;
      Products.update({_id: productId}, {$set: {
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        tags: inputTags
      }});
      growl('OK', inputName+' mis à jour', 'success');
      var placeId = Router.current().params.place_id;
      Router.go('productsPlace', {_id: placeId});
    }
  }
});

Template.editProduct.helpers({
  place_id: function () {
    return Router.current().params.place_id;
  }
});