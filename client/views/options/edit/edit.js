Template.editOption.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputTitle = tmpl.find('#inputTitle').value.trim();
    var inputType = tmpl.find('input:radio[name=radioType]:checked').value;
    var inputChoices = tmpl.find('#inputChoices').value.split(',');
    if (inputTitle !== '' && inputChoices !== '') {
      var optionId = Router.current().params.option_id;
      Options.update({_id: optionId}, {$set: {
        title: inputTitle,
        type: inputType,
        choices: inputChoices
      }});
      if (inputChoices.length > 0) {
        $.each(inputChoices, function(index, value) {
          if (value !== '') {
            Options.addTag(value, 'Options', {_id: optionId});
          }
        });
      }
      growl('OK', 'L\'option '+inputTitle+' est à jour', 'success');
      var placeId = Router.current().params.place_id;
      Router.go('optionsPlace', {_id: placeId});
    }
  },
  'click .delete': function (evt, tmpl) {
    var optionId = this._id;

    swal(
      {
        title: "Êtes vous sur ?",
        text: "La suppression d'une option entraine son retrait de tous les produit associés",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(){
        Options.remove({_id: optionId});
        var products = Products.find({options: optionId}).fetch();
        $.each(products, function(index, product) {
           Products.update({_id: product._id}, {$pull: {options: optionId}});
        });
        var placeId = Router.current().params.place_id;
        Router.go('optionsPlace', {_id: placeId});
        growl('OK', 'Option supprimée', 'danger');
      }
    );
  }
});

Template.editOption.helpers({
  place_id: function () {
    return Router.current().params.place_id;

  }
});
