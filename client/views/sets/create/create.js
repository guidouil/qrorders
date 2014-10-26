Template.createSet.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputPrice = tmpl.find('#inputPrice').value;
    var inputDesc = tmpl.find('#inputDesc').value.trim();
    var inputTags = tmpl.find('#inputTags').value.split(',');
    var inputProducts = [];
    if ($('.inputProducts:checked')) {
      $('.inputProducts:checked').each(function(){
        inputProducts.push(this.id);
      });
    };
    if (inputName != '' && inputPrice != '' && inputProducts.length > 0) {
      inputPrice = parseFloat(inputPrice).toFixed(2);
      var setId = Sets.insert({
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        places: [this._id],
        owners: [Meteor.userId()],
        products: inputProducts
      });
      if (inputTags.length > 0) {
        $.each(inputTags, function(index, value) {
          if (value != '') {
            Sets.addTag(value, 'Sets', {_id: setId});
          };
        });
      };
      swal("Cool !", "Vous avez ajouté une formule "+inputName, "success");
      Router.go('setsPlace', {_id: this._id});
    };
  }
});