Template.createPlace.events({
  'click .addUser': function (evt, tmpl) {
    evt.preventDefault();
    var  inputMail, inputPassword = '';
    if (tmpl.find('#inputMail')) {
      inputMail = tmpl.find('#inputMail').value;
      inputPassword = tmpl.find('#inputPassword').value;
    }

    if ( inputMail !== '' && inputPassword !== '') {
      var valid = true;
      $('.form-group').removeClass('has-error');
      $('.form-group').removeClass('has-warning');

      inputMail = $.trim(inputMail);
      inputPassword = $.trim(inputPassword);

      if(!validateEmail(inputMail)) {
        // email faux !
        $('#mail').addClass('has-error');
        $('#inputMail').focus();
        growl('Erreur', 'Adresse email invalide');
        valid = false;
      }

      if (inputPassword.length < 7) {
        // mot de passe trop court
        $('#password').addClass('has-error');
        $('#inputPassword').focus();
        growl('Erreur', 'Mot de passe trop court');
        valid = false;
      }

      if (valid === true) {
        // tout vas bien, on créé l'utilisateur
        Accounts.createUser({email: inputMail, password : inputPassword}, function(err){
          if (err) {
            swal("Oops...", "Problème avec la création du compte", "error");
          } else {
            swal("Impec !", "Le compte à été créé!", "success");
            $('#inputName').focus();
          }
        });
      }
    } else {
      $('.form-group').addClass('has-error');
      growl('Erreur', 'Tous les champs sont obligatoires');
    }
  },
  'click .addPlace': function (evt, tmpl) {
    evt.preventDefault();
    var inputName, inputPhone = '';
    inputName = tmpl.find('#inputName').value;
    inputPhone = tmpl.find('#inputPhone').value;

    if (inputName !== '' && inputPhone  !== '' && Meteor.userId()) {
      var valid = true;
      $('.form-group').removeClass('has-error');
      $('.form-group').removeClass('has-warning');
      inputName = $.trim(inputName);
      inputPhone = $.trim(inputPhone);

      if (!validatePhone(inputPhone)) {
        // téléphone faux !
        $('#phone').addClass('has-error');
        $('#inputPhone').focus();
        growl('Erreur', 'Numéro de téléphone invalide');
        valid = false;
      }

      if (valid === true) {
        var placeId = Places.insert({
          placename: inputName,
          phone: inputPhone,
          owner: [Meteor.userId()],
          waiter: [Meteor.userId()],
          created: Date.now()
        });
        OrdersNumbers.insert({_id: placeId, seq: 0});
        swal("Génial !", "Le restaurant " + inputName + " à été créé!", "success");
        Meteor.call('user_set_owner');
        Meteor.call('user_set_waiter', placeId);
        Router.go('owner');
      }
    } else {
      $('.form-group').addClass('has-error');
      growl('Erreur', 'Tous les champs sont obligatoires');
    }
  }
});

Template.createPlace.helpers({
  isNotLoggedIn: function () {
    if (!Meteor.userId()) {
      return true;
    }
    return false;
  }
});
