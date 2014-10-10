Template.editPlace.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    $('.form-group').removeClass('has-error');
    var inputName = tmpl.find('#inputName').value;
    var inputPhone = tmpl.find('#inputPhone').value;
    var inputStreet = tmpl.find('#inputStreet').value;
    var inputTown = tmpl.find('#inputTown').value;
    var inputZip = tmpl.find('#inputZip').value;
    // var inputDesc = tmpl.find('#inputDesc').value;
    var valid = true;
    if (!validatePhone(inputPhone)) {
      // téléphone faux !
      $('#phone').addClass('has-error');
      $('#inputPhone').focus();
      growl('Erreur', 'Numéro de téléphone invalide');
      var valid = false;
    };

    if(valid === true) {
      Places.update(
        {_id: this._id},
        {$set:
          {
            name: inputName,
            phone: inputPhone,
            street: inputStreet,
            town: inputTown,
            zip: inputZip
          }
        },
        function(error, result) {
          if (error && error.invalidKeys) {
            for (var key in error.invalidKeys) {
              growl('KO', error.invalidKeys[key].name + ' is ' + error.invalidKeys[key].type);
              $('#'+error.invalidKeys[key].name).addClass('has-error');
            };
          } else {
            growl('OK', 'Restaurant mis à jour','success');
          };
        }
      );
    }
  }
});