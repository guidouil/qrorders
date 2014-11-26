UI.registerHelper('formatPrice', function(price) {
  if(price) {
    switch(Session.get('language')) {
      case 'fr' :
        return parseFloat(price).toMoney(2,',',' ') + '€';
        break;
      default :
      case 'en' :
        return '€' + parseFloat(price).toMoney(2,'.',',');
        break;
    }
  }
});

/*
decimal_sep: character used as deciaml separtor, it defaults to '.' when omitted
thousands_sep: char used as thousands separator, it defaults to ',' when omitted
*/
Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep)
{
   var n = this,
   c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
   d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

   /*
   according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
   the fastest way to check for not defined parameter is to use typeof value === 'undefined'
   rather than doing value === undefined.
   */
   t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

   sign = (n < 0) ? '-' : '',

   //extracting the absolute value of the integer part of the number and converting to string
   i = parseInt(n = Math.abs(n).toFixed(c)) + '',

   j = ((j = i.length) > 3) ? j % 3 : 0;
   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

UI.registerHelper('formatDate', function(date){
  return moment(date).format('DD/MM/YYYY HH:mm');
});
UI.registerHelper('fromNow', function(date){
  if(date !== null) {
    var oDate = moment(date);
    oDate.lang(Session.get('language'));
    return oDate.fromNow();
  }
});

UI.registerHelper('textStatus', function(status) {
  var result = false;
  switch (status) {
    case 0:
      result = '<span class="label label-danger">Annulée</span>';
      break;
    case 1:
      result = '<span class="label label-warning">En création</span>';
      break;
    case 2:
      result = '<span class="label label-primary">Validée</span>';
      break;
    case 3:
      result = '<span class="label label-info">En cours</span>';
      break;
    case 4:
      result = '<span class="label label-success">Servie</span>';
      break;
    default :
      result = '<span class="label label-muted">Houston?</span>';
      break;
  }
  return result;
});

UI.registerHelper('arrayToString', function (array) {
  return array.toString();
});

UI.registerHelper('arrayLength', function (array) {
  return array.length;
});

UI.registerHelper('isNotLoggedIn', function () {
  if (!Meteor.userId()) {
    return true;
  }
  return false;
});
UI.registerHelper('isLoggedIn', function () {
  if (Meteor.userId()) {
    return true;
  }
  return false;
});

UI.registerHelper('showTags', function (tags) {
  if (tags && tags.length > 0) {
    var tagsString = '';
    $.each(tags, function(index, tag) {
      tagsString += '<span class="label label-info">'+tag+'</span> ';
    });
    return tagsString;
  }
});

UI.registerHelper('getImage', function (imgId) {
  var image = Images.findOne({_id: imgId});
  if (image && image.url()) {
    return image.url();
  }
});
