Template.editQrCode.events({
  'click .save': function (evt, tmpl) {
    evt.preventDefault();
    var inputCode = tmpl.find('#inputCode').value;
    check(inputCode, String);
    if (inputCode !== '') {
      var codeCount = Places.find({code: inputCode}).count();
      if (codeCount === 0) {
        Places.update({_id: this._id}, {$set: {code: encodeURI(inputCode)}});
        Session.set('qrcode', inputCode);
        $('#qrcode').html('');
        $('#qrcode').qrcode({text:"http://jecmd.fr/a/" + inputCode});
        growl('OK', 'QR Code mis à jour','success');
      } else {
        growl('KO', 'Code déjà utilisé','danger');
      }
    }
  }
});

Template.editQrCode.helpers({
  qrcode: function (code) {
    Session.set('qrcode', code);
  }
});

Template.editQrCode.rendered = function () {
  if (Session.get('qrcode')) {
    $('#qrcode').qrcode({text:"http://jecmd.fr/a/" + Session.get('qrcode')});
  }
};
