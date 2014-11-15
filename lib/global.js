// Global functions
this.trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
};

this.validateEmail = function(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};
this.validatePhone = function(phone) {
  var regex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
  return regex.test(phone);
};

this.growl = function(title, message, type) {
  if (!type) type = "warning";
  $.growl({
    icon:'glyphicon glyphicon-info-sign',
    title:'<strong> '+title+' </strong>',
    message: message
  },{
    type: type,
    delay: 1618
  });
};
