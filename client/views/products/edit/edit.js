Template.editProduct.events({
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
    if ($('.inputOptions:checkbox')) {
      $('.inputOptions:checkbox').each(function(){
        Options.update({_id: this.id}, {$pull: {products: productId}});
      });
    }
    if (inputName !== '' && inputPrice !== '') {
      var productId = Router.current().params.product_id;
      Products.update({_id: productId}, {$set: {
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        options: inputOptions
      }});
      if (inputOptions.length > 0) {
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
      growl('OK', inputName+' mis à jour', 'success');
      var placeId = Router.current().params.place_id;
      Router.go('productsPlace', {_id: placeId});
    }
  },
  'click .delete': function (evt, tmpl) {
    var productId = this._id;
    swal(
      {
        title: "Êtes vous sur ?",
        text: "La suppression d'un produit est définitive.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(){
        Products.remove({_id: productId});
        growl('OK', 'Produit supprimé', 'danger');
        var placeId = Router.current().params.place_id;
        Router.go('productsPlace', {_id: placeId});
      }
    );
  },
  'change #inputImage': function(event, template) {
    event.preventDefault();
    var productId = this._id;
    var file = template.find('#inputImage').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      Products.update({_id: productId}, {$set: {imageTmp: e.target.result}});
    };
    reader.readAsDataURL(file);
    $('#imageModal').modal();
  }
});

Template.editProduct.helpers({
  place_id: function () {
    return Router.current().params.place_id;
  }
});
