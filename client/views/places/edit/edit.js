Template.editPlace.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    $('.form-group').removeClass('has-error');
    var inputName = tmpl.find('#inputName').value;
    var inputPhone = tmpl.find('#inputPhone').value;
    var inputStreet = tmpl.find('#inputStreet').value;
    var inputTown = tmpl.find('#inputTown').value;
    var inputZip = tmpl.find('#inputZip').value;
    var inputDesc = tmpl.find('#inputDesc').value;
    var inputTags = tmpl.find('#inputTags').value.split(',');
    var valid = true;
    if (!validatePhone(inputPhone)) {
      // téléphone faux !
      $('#phone').addClass('has-error');
      $('#inputPhone').focus();
      growl('Erreur', 'Numéro de téléphone invalide');
      valid = false;
    }

    if(valid === true) {
      var placeId = this._id;
      Places.update(
        {_id: this._id},
        {$set:
          {
            placename: inputName,
            phone: inputPhone,
            street: inputStreet,
            town: inputTown,
            zip: inputZip,
            desc: inputDesc
          }
        },
        function(error, result) {
          if (error && error.invalidKeys) {
            for (var key in error.invalidKeys) {
              growl('KO', error.invalidKeys[key].name + ' is ' + error.invalidKeys[key].type);
              $('#'+error.invalidKeys[key].name).addClass('has-error');
            }
          } else {
            growl('OK', 'Restaurant mis à jour','success');
          }
        }
      );
      if (inputTags.length > 0) {
        $.each(inputTags, function(index, value) {
          if (value !== '') {
            Places.addTag(value, 'Places', {_id: placeId});
          }
        });
      }
    }
  }
});

Template.editPlace.rendered = function () {
  Meteor.call('getTags', 'Places', function (error, result) {
    if (!result || result.length === 0) {
      result = [];
    }
    $('#inputTags').selectize({
      valueField: 'name',
      labelField: 'name',
      searchField: ['name'],
      delimiter: ',',
      persist: false,
      create: function(input) {
        return {
          name: input
        };
      },
      options: result,
      onItemRemove: function(value) {
        if (Router.current().path.search('edit/') == 1) {
          var placeId = Router.current().params._id;
          Places.removeTag(value, 'Places', {_id: placeId});
        }
      }
    });
  });
};
