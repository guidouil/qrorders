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
    var inputLoyaltyCard = false;
    if ($('#inputLoyaltyCard').prop( "checked" )) {
      inputLoyaltyCard = true;
    }
    var inputLcPrice = tmpl.find('#inputLcPrice').value;
    var inputLcSize = tmpl.find('#inputLcSize').value;
    var inputLcReward = tmpl.find('#inputLcReward').value;
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
            placedesc: inputDesc,
            loyaltyCard: inputLoyaltyCard,
            lcPrice: inputLcPrice,
            lcSize: inputLcSize,
            lcReward: inputLcReward,
            updated: Date.now()
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
  },
  'change #inputImage': function(event, template) {
    event.preventDefault();
    var placeId = Router.current().params._id;
    var file = template.find('#inputImage').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      // Places.update({_id: placeId}, {$set: {imageTmp: e.target.result}});
      Session.set('imageTemp', e.target.result);
    };
    reader.readAsDataURL(file);
    $('#imageModal').modal();
  },
  'click #inputImageMobile': function (event, template) {
    event.preventDefault();
    var cameraOptions = {
      width: 1024,
      height: 633
    };
    MeteorCamera.getPicture(cameraOptions, function (error, data) {
      Session.set("imageTemp", data);
    });
    $('#imageModal').modal();
  },
  'click .delete': function (evt, tmpl) {
    var placeId = this._id;
    swal(
      {
        title: "Êtes vous sur ?",
        text: "La suppression d'un établissement est définitive.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(){
        if (this.image) {
          Meteor.call('delete_image', this.image);
        }
        Places.remove({_id: placeId});
        Meteor.call('clean_the_place',placeId);
        Meteor.call('user_unset_owner');
        Meteor.call('user_unset_waiter',placeId);
        growl('OK', 'Établissement supprimé', 'danger');
        Router.go('owner');
      }
    );
  }
});

Template.editPlace.helpers({
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
        if (Router.current().lookupTemplate() === 'EditPlace') {
          var placeId = Router.current().params._id;
          Places.removeTag(value, 'Places', {_id: placeId});
        }
      }
    });
  });
};
