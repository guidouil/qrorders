Template.createProduct.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputPrice = tmpl.find('#inputPrice').value;
    var inputDesc = tmpl.find('#inputDesc').value.trim();
    if (inputName != '' && inputPrice != '') {
      inputPrice = parseFloat(inputPrice).toFixed(2);
      Products.insert({
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        place: this._id,
        owner: [Meteor.userId()]
      });
      swal("Cool !", "Vous avez ajouté un(e) "+inputName, "success");
    };
    Router.go('productsPlace', {_id: this._id});
  }
});