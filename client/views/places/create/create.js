Template.createPlace.events({
  'click .addPlace': function (evt, tmpl) {
    evt.preventDefault();
    var inputName = tmpl.find('#inputName').value;
    var inputPhone = tmpl.find('#inputPhone').value;
    var inputMail = tmpl.find('#inputMail').value;
  }
});