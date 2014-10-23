Template.editOption.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputMin = tmpl.find('#inputMin').value;
    var inputMax = tmpl.find('#inputMax').value;
    var inputChoices = tmpl.find('#inputChoices').value.split(',');
    if (inputName != '' && inputChoices != '') {
      var optionId = Router.current().params.option_id;
      Options.update({_id: optionId}, {$set: {
        name: inputName,
        min: inputMin,
        max: inputMax,
        choices: inputChoices
      }});
      //console.log(inputTags);
      if (inputChoices.length > 0) {
        $.each(inputChoices, function(index, value) {
          if (value != '') {
            Options.addTag(value, 'Options', {_id: optionId});
          };
        });
      };
      growl('OK', 'L\'option '+inputName+' est à jour', 'success');
      var placeId = Router.current().params.place_id;
      Router.go('optionsPlace', {_id: placeId});
    }
  },
  'click .delete': function (evt, tmpl) {
    Options.remove({_id: this._id});
    growl('OK', 'Produit supprimé', 'danger');
    var placeId = Router.current().params.place_id;
    Router.go('optionsPlace', {_id: placeId});
  }
});

Template.editOption.helpers({
  place_id: function () {
    return Router.current().params.place_id;

  }
});