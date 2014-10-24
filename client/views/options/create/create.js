Template.createOption.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputTitle = tmpl.find('#inputTitle').value.trim();
    var inputType = tmpl.find('input:radio[name=radioType]:checked').value;
    var inputChoices = tmpl.find('#inputChoices').value.split(',');
    if (inputTitle != '' && inputChoices != '') {

      var optionId = Options.insert({
        products: [],
        title: inputTitle,
        type: inputType,
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
      swal("Cool !", "Vous avez ajouté une option "+inputTitle, "success");
    };
    Router.go('optionsPlace', {_id: this._id});
  }
});