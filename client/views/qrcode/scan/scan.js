Template.scanQrCode.helpers({
  scanned: function () {
  }
});
qrScanner.on('scan', function(err, message) {
  if (message !== null) {
    return alert(message);
  }
});
