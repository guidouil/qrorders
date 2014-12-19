Template.editSet.events({
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
    }
    if (inputName !== '' && inputPrice !== '' && inputProducts.length > 0) {
      var setId = Router.current().params.set_id;
      Sets.update({_id: setId}, {$set: {
        name: inputName,
        price: inputPrice,
        desc: inputDesc,
        products: inputProducts
      }});
      if (inputTags.length > 0) {
        $.each(inputTags, function(index, value) {
          if (value !== '') {
            Sets.addTag(value, 'Sets', {_id: setId});
          }
        });
      }
      growl('OK', inputName+' mis à jour', 'success');
      var placeId = Router.current().params.place_id;
      Router.go('setsPlace', {_id: placeId});
    }
  },
  'click .delete': function (evt, tmpl) {
    var setId = this._id;
    swal(
      {
        title: "Êtes vous sur ?",
        text: "La suppression d'une formule est définitive.",
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
        Sets.remove({_id: setId});
        growl('OK', 'Formule supprimée', 'danger');
        var placeId = Router.current().params.place_id;
        Router.go('setsPlace', {_id: placeId});
      }
    );
  },
  'change #inputImage': function(event, template) {
    event.preventDefault();
    var setId = this._id;
    var file = template.find('#inputImage').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      // Sets.update({_id: setId}, {$set: {imageTmp: e.target.result}});
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
  }
});

Template.editSet.helpers({
  place_id: function () {
    return Router.current().params.place_id;
  }
});
