Template.formOrder.rendered = function () {
    $('.clockpicker').clockpicker({
      placement: 'top',
      align: 'left',
      autoclose: true
    });
    function readNotification() {
      var orderId = Router.current().params.order_id;
      if (orderId) {
        var order = Orders.findOne({_id: orderId});
        if (order && order.waiter[0] === Meteor.userId() && order.notifyWaiter) {
          Orders.update({_id: orderId}, {$set: {notifyWaiter: false, updated: Date.now()}});
        }
        if (order && order.user === Meteor.userId() && order.notifyUser) {
          Orders.update({_id: orderId}, {$set: {notifyUser: false, updated: Date.now()}});
        }
      }
    }
    Meteor.setTimeout(readNotification,3000);
};

Template.formOrder.helpers({
  place: function() {
    var placeId = Router.current().params.place_id;
    Session.set('placeId', placeId);
    return Places.findOne({_id: placeId});
  },
  products: function () {
    return Products.find({},{sort:{ProductsTags: -1, price: -1}}).fetch();
  },
  sets: function () {
    return Sets.find({},{sort:{SetsTags: -1, price: -1}}).fetch();
  },
  order: function () {
    var orderId = Session.get('orderId');
    return Orders.findOne({_id: orderId});
  },
  lines: function() {
    var orderId = Session.get('orderId');
    return Lines.find({order: orderId}).fetch();
  },
  currentDate: function () {
    return moment().format("DD/MM/YYYY HH:mm");
  },
  number: function() {
    var placeId = Router.current().params.place_id;
    var orderNumber = OrdersNumbers.findOne({_id: placeId});
    if (!orderNumber || !orderNumber.seq) {
      return 1;
    } else {
      return parseFloat(orderNumber.seq+1);
    }
  },
  isActiveOrder: function () {
    return Session.get('orderId');
  },
  isStatusActive: function (status) {
    if (!Session.get('orderStatus')) {
      var orderId = Session.get('orderId');
      order = Orders.findOne({_id: orderId});
      Session.set('orderStatus', order.status);
    }
    return (status == Session.get('orderStatus')?'active':'');
  },
  isStatusChecked: function (status) {
    if (!Session.get('orderStatus')) {
      var orderId = Session.get('orderId');
      order = Orders.findOne({_id: orderId});
      Session.set('orderStatus', order.status);
    }
    return (status == Session.get('orderStatus')?'checked':'');
  },
  isNotWaiter: function () {
    if (!Meteor.userId()) {
      return false;
    }
    var placeId = Router.current().params.place_id;
    var place = Places.findOne({_id: placeId});
    if (place && _.contains(place.waiter, Meteor.userId())) {
      return false;
    }
    var orderId = Router.current().params.order_id;
    if (orderId) {
      var order = Orders.findOne({_id: orderId});
      if (order && order.status === 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  isWaiter: function () {
    if (!Meteor.userId()) {
      return false;
    }
    var placeId = Router.current().params.place_id;
    var place = Places.findOne({_id: placeId});
    if (place && _.contains(place.waiter, Meteor.userId()) && (Session.get('orderStatus') === false || Session.get('orderStatus') === 1)) {
      return true;
    } else {
      return false;
    }
  },
  inCreation: function () {
    if (!Meteor.userId()) {
      return false;
    }
    if (Session.get('orderStatus') === false || Session.get('orderStatus') === 1) {
      return true;
    } else {
      return false;
    }
  },
  theTime: function () {
    return moment().add(10, 'minutes').format('HH:mm');
  }
});

Template.formOrder.events({
  'click .decQty': function (evt, tmpl) {
    var productId = evt.currentTarget.attributes.id.value;
    var value = $('#qty-'+productId).val();
    if (value > 1) {
      $('#qty-'+productId).val(parseFloat(value) - 1);
    }
  },
  'click .incQty': function (evt, tmpl) {
    var productId = evt.currentTarget.attributes.id.value;
    var value = $('#qty-'+productId).val();
    $('#qty-'+productId).val(parseFloat(value) + 1);
  },
  'click .productModal': function (evt,tmpl) {
    var productId = evt.currentTarget.attributes.id.value;
    Session.set('setId', false);
    Session.set('productId', productId);
    $('#productModal').modal();
  },
  'click .placeModal': function (evt,tmpl) {
    var placeId = evt.currentTarget.attributes.id.value;
    Session.set('placeId', placeId);
    $('#placeModal').modal();
  },
  'click .setModal': function (evt,tmpl) {
    var setId = evt.currentTarget.attributes.id.value;
    Session.set('productId', false);
    Session.set('setId', setId);
    $('#productModal').modal();
  },
  'click .changeStatus': function (evt, tmpl) {
    evt.preventDefault();
    var newStatus = evt.currentTarget.attributes.value.value;
    var orderId = Session.get('orderId');
    var order = Orders.findOne({_id: orderId});
    if ( _.contains(order.waiter, Meteor.userId()) ) {
      var chat = {
        userId: Meteor.userId(),
        username: Meteor.user().profile.name,
        created: Date.now(),
        message: 'La commande vient de passer en statut : '+orderStatus(newStatus),
        side: 'left'
      };
      var notify = true;
      if (order.user === Meteor.userId()) {
        notify = false;
      }
      Orders.update({_id: orderId}, {$set: {status: newStatus, updated: Date.now(), notifyUser: notify}, $push: {chats: chat}});
      if (order.user !== Meteor.userId()) {
        Meteor.call('notify_order_status', orderId, order.user, newStatus);
      }
      Session.set('orderStatus', newStatus);
    } else {
      Session.set('orderStatus', order.status);
    }
  },
  'click .deleteLine': function (evt, tmpl) {
    evt.preventDefault();
    var lineId = evt.currentTarget.attributes.id.value;
    var line = Lines.findOne({_id: lineId});
    var order = Orders.findOne({_id: line.order});
    if (line.waiter == Meteor.userId() || (line.user == Meteor.userId() && order.status <= 1)) {
      Orders.update({_id: line.order}, {$inc: {total: -line.price}, $set: { updated: Date.now()}});
      Lines.remove({_id: lineId});
    }
  },
  'click .customerValidation': function (evt, tmpl) {
    evt.preventDefault();
    var orderId = Session.get('orderId');
    var timeWanted = tmpl.find('#timeWanted').value;
    var inTen = moment().add(10, 'minutes').format('HH:mm');
    if (timeWanted < inTen) {
      timeWanted = inTen;
    }
    var inputTogo = tmpl.find('input:radio[name=togos]:checked').value;
    inputTogo = (inputTogo === 'true');
    var chat = {
      userId: Meteor.userId(),
      username: Meteor.user().profile.name,
      created: Date.now(),
      message: 'La commande vient de passer en statut : '+orderStatus(2),
      side: 'right'
    };
    Orders.update({_id: orderId}, {$set: {status: 2, updated: Date.now(), wanted: timeWanted, notifyWaiter: true, togo: inputTogo}, $push: {chats: chat}});
    var order = Orders.findOne({_id: orderId});
    Meteor.call('notify_order_status', orderId, order.waiter[0], 2);
    swal('Merci','Votre commande est validée','success');
    Router.go('cart');
  },
  'click .waiterValidation': function (evt, tmpl) {
    evt.preventDefault();
    var orderId = Session.get('orderId');
    var timeWanted = tmpl.find('#timeWanted').value;
    var inTen = moment().add(10, 'minutes').format('HH:mm');
    if (timeWanted < inTen) {
      timeWanted = inTen;
    }
    var inputTogo = tmpl.find('input:radio[name=togos]:checked').value;
    inputTogo = (inputTogo === 'true');
    var chat = {
      userId: Meteor.userId(),
      username: Meteor.user().profile.name,
      created: Date.now(),
      message: 'La commande vient de passer en statut : '+orderStatus(2),
      side: 'left'
    };
    Orders.update({_id: orderId}, {$set: {status: 2, updated: Date.now(), wanted: timeWanted, togo: inputTogo}, $push: {chats: chat}});
    var order = Orders.findOne({_id: orderId});
    var placeId = Router.current().params.place_id;
    Router.go('waiter', {_id: placeId});
  },
  'click .addProduct': function (evt,tmpl) {
    evt.preventDefault();
    $('#productModal').modal('hide');
    var placeId = Router.current().params.place_id;
    var orderId = Session.get('orderId');

    var productId = evt.currentTarget.attributes.id.value;
    var productName = evt.currentTarget.attributes.name.value;
    var quantity = $('#qty-'+productId).val();
    if (!quantity) {
      quantity = 1;
    }
    var product = Products.findOne({_id: productId});

    // Product Options Mgmt
    var selectedOptions = [];
    var optionChoices = [];
    if (product.options.length > 0) {

      var optionMessage = '<form class="form-horizontal">';
      $.each(product.options, function(index, optionId) {
        var option = Options.findOne({_id: optionId});
        optionMessage += '<div class="form-group">';
        optionMessage += '<label class="col-xs-3 control-label" for="'+option.title+'">'+option.title+'</label>';
        optionMessage += '<div class="col-xs-9">';
        $.each(option.choices, function(i, choice) {
          optionMessage += '<div class="'+option.type+' '+option.type+'-success">';
          optionMessage += '<label for="'+option.title+'-'+i+'">';
          optionMessage += '<input class="productOptions" type="'+option.type+'" name="'+option.title+'" id="'+option.title+'-'+i+'" value="'+choice+'">';
          if(option.type === 'radio') {
            optionMessage += '<span class="circle"></span>';
          } else {
            optionMessage += '<span class="ripple"></span>';
          }
          optionMessage += '<span class="check"></span>';
          optionMessage += choice;
          optionMessage += '</label>';
          optionMessage += '</div>';
        });
        optionMessage += '</div>';
        optionMessage += '</div>';
      });
      optionMessage += '</form>';

      bootbox.dialog({
        animate: false,
        message: optionMessage,
        title: '<strong>'+productName+'</strong> Options',
        buttons: {
          danger: {
            label: "Annuler",
            className: "btn-danger"
          },
          success: {
            label: "Valider",
            className: "btn-success",
            callback: function() {
              var selectedOptions = {};
              var prevOption = '';
              var optionsString = '';
              if($('.productOptions:checked')) {
                $('.productOptions:checked').each(function(index, choice) {
                  var currentOption = choice.name;
                  if (currentOption != prevOption) {
                    if (prevOption !== '') {
                      optionsString += ' | ';
                    }
                    optionsString += currentOption+' : ';
                    prevOption = currentOption;
                  } else {
                    optionsString += ', ';
                  }
                  optionsString += choice.value;
                });
              }
              addOrderLine(optionsString);
            }
          }
        }
      });
    } else {
      addOrderLine();
    }

    function addOrderLine (optionsString) {
      var place = Places.findOne({_id: placeId});
      var userId = Meteor.userId();
      if (!orderId) {
        OrdersNumbers.update({_id: placeId}, {$inc: {seq: 1}});
        orderNumber = OrdersNumbers.findOne({_id: placeId});
        var user = Meteor.user();
        var orderName = user.profile.name;
        if (!orderName) {
          var mail = user.emails[0].address;
          aMail = mail.split('@');
          orderName = aMail[0];
        }
        orderId = Orders.insert({
          number: orderNumber.seq,
          name: orderName,
          total: 0.00,
          created: Date.now(),
          place: placeId,
          waiter: place.waiter,
          status: 1,
          user: userId,
          paid: false
        });
        Session.set('orderId', orderId);
      }

      var linePrice = product.price * quantity;
      var lineId = Lines.insert({
        order: orderId,
        place: placeId,
        waiter: place.waiter,
        productId: productId,
        productName: productName,
        quantity: quantity,
        price: linePrice,
        created: Date.now(),
        status: 1,
        user: userId,
        options: optionsString
      });
      Orders.update({_id: orderId}, {$inc: {total: linePrice}, $set: {updated: Date.now()}});
      $('#qty-'+productId).val(1);
      growl(quantity, productName+'(s) ajouté(e)(s)', 'success');
    }

  },
  'click .addSet': function (evt,tmpl) {
    evt.preventDefault();
    $('#productModal').modal('hide');
    var placeId = Router.current().params.place_id;
    var orderId = Session.get('orderId');

    var setId = evt.currentTarget.attributes.id.value;
    var setName = evt.currentTarget.attributes.name.value;
    var quantity = $('#qty-'+setId).val();
    var set = Sets.findOne({_id: setId});

    // Sets Options Mgmt
    var optionFound = false;
    var optionMessage = '<form class="form-horizontal">';
    $.each(set.products, function(index, productId) {
      var product = Products.findOne({_id: productId});
      if (product.options.length > 0) {
        optionFound = true;
        optionMessage += '<legend>'+product.name+' options</legend>';
        $.each(product.options, function(index, optionId) {
          var option = Options.findOne({_id: optionId});
          optionMessage += '<div class="form-group">';
          optionMessage += '<label class="col-xs-3 control-label" for="'+option.title+'">'+option.title+'</label>';
          optionMessage += '<div class="col-xs-9">';
          $.each(option.choices, function(i, choice) {
            optionMessage += '<div class="'+option.type+' '+option.type+'-success">';
            optionMessage += '<label for="'+product.name+option.title+'-'+i+'">';
            optionMessage += '<input class="productOptions" type="'+option.type+'" name="'+product.name+option.title+'" id="'+product.name+option.title+'-'+i+'" value="'+choice+'">';
            if(option.type === 'radio') {
              optionMessage += '<span class="circle"></span>';
            } else {
              optionMessage += '<span class="ripple"></span>';
            }
            optionMessage += '<span class="check"></span>';
            optionMessage += choice;
            optionMessage += '</label>';
            optionMessage += '</div>';
          });
          optionMessage += '</div>';
          optionMessage += '</div>';
        });
      }
    });
    optionMessage += '</form>';

    if(optionFound === true) {
      bootbox.dialog({
        animate: false,
        message: optionMessage,
        title: 'Options de la formule <strong>'+setName+'</strong>',
        buttons: {
          danger: {
            label: "Annuler",
            className: "btn-danger"
          },
          success: {
            label: "Valider",
            className: "btn-success",
            callback: function() {
              var selectedOptions = {};
              var prevOption = '';
              var optionsString = '';
              if($('.productOptions:checked')) {
                $('.productOptions:checked').each(function(index, choice) {
                  var currentOption = choice.name;
                  if (currentOption != prevOption) {
                    if (prevOption !== '') {
                      optionsString += ' | ';
                    }
                    optionsString += currentOption+' : ';
                    prevOption = currentOption;
                  } else {
                    optionsString += ', ';
                  }
                  optionsString += choice.value;
                });
              }
              addOrderLine(optionsString);
            }
          }
        }
      });
    } else {
      addOrderLine();
    }


    function addOrderLine (optionsString) {
      var place = Places.findOne({_id: placeId});
      var userId = Meteor.userId();
      if (!orderId) {
        OrdersNumbers.update({_id: placeId}, {$inc: {seq: 1}});
        orderNumber = OrdersNumbers.findOne({_id: placeId});
        var user = Meteor.user();
        var orderName = user.profile.name;
        if (!orderName) {
          var mail = user.emails[0].address;
          aMail = mail.split('@');
          orderName = aMail[0];
        }
        orderId = Orders.insert({
          number: orderNumber.seq,
          name: orderName,
          total: 0.00,
          created: Date.now(),
          place: placeId,
          waiter: place.waiter,
          status: 1,
          user: userId,
          paid: false
        });
        Session.set('orderId', orderId);
      }
      var linePrice = set.price * quantity;
      var lineId = Lines.insert({
        order: orderId,
        place: placeId,
        waiter: place.waiter,
        setId: setId,
        setName: setName,
        quantity: quantity,
        price: linePrice,
        created: Date.now(),
        status: 1,
        user: userId,
        options: optionsString
      });
      Orders.update({_id: orderId}, {$inc: {total: linePrice}, $set: {updated: Date.now()}});
      $('#qty-'+setId).val(1);
      growl(quantity, setName+'(s) ajouté(e)(s)', 'success');
    }
  }
});
