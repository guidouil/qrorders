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
        $('#qrcode').qrcode({text:"https://jecmd.fr/a/" + inputCode});
        growl('OK', 'QR Code mis à jour','success');
      } else {
        growl('KO', 'Code déjà utilisé','danger');
      }
    }
  },
  'click .qrlarge': function (evt, tmpl) {
    evt.preventDefault();
    $('#qrcode').html('');
    $('#qrcode').qrcode({width: 1024,height: 1024,text:"https://jecmd.fr/a/" + Session.get('qrcode')});
  }
});

Template.editQrCode.helpers({
  qrcode: function (code) {
    Session.set('qrcode', code);
  }
});

Template.editQrCode.rendered = function () {
  $('#qrcode').html('');
  if (Session.get('qrcode')) {
    $('#qrcode').qrcode({text:"https://jecmd.fr/a/" + Session.get('qrcode')});
  }
};
