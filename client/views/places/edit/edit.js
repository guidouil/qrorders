Template.editPlace.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value;
    var inputPhone = tmpl.find('#inputPhone').value;
    var inputStreet = tmpl.find('#inputStreet').value;
    var inputTown = tmpl.find('#inputTown').value;
    var inputZip = tmpl.find('#inputZip').value;
    // var inputDesc = tmpl.find('#inputDesc').value;
    Places.update({_id: this._id}, {$set:{
      name: inputName,
      phone: inputPhone,
      street: inputStreet,
      town: inputTown,
      zip: inputZip
    }});
    growl('OK', 'Restaurant mis à jour','success');
  }
});