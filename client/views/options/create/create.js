Template.createOption.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value.trim();
    var inputMin = tmpl.find('#inputMin').value;
    var inputMax = tmpl.find('#inputMax').value;
    var inputChoices = tmpl.find('#inputChoices').value.split(',');
    if (inputName != '' && inputChoices != '') {

      var optionId = Options.insert({
        name: inputName,
        min: inputMin,
        max: inputMax,
        choices: inputChoices,
        places: [this._id],
        owners: [Meteor.userId()]
      });
      if (inputChoices.length > 0) {
        $.each(inputChoices, function(index, value) {
          if (value != '') {
            Options.addTag(value, 'Options', {_id: optionId});
          };
        });
      };
      swal("Cool !", "Vous avez ajouté une option "+inputName, "success");
    };
    Router.go('optionsPlace', {_id: this._id});
  }
});