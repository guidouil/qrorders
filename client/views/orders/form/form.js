Template.formOrder.helpers({
  place: function() {
    var placeId = Router.current().params.place_id;
    Session.set('placeId', placeId);
    return Places.findOne({_id: placeId});
  },
  products: function () {
    return Products.find().fetch();
  },
  sets: function () {
    return Sets.find().fetch();
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
    var orderId = Router.current().params.order_id;
    if (orderId) {
      var order = Orders.findOne({_id: orderId});
      if (order.status != 1) {
        return false;
      };
    }
    var placeId = Router.current().params.place_id;
    var place = Places.findOne({_id: placeId});
    if (place && _.contains(place.waiter, Meteor.userId())) {
      return false;
    } else {
      return true;
    };
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
  'click .changeStatus': function (evt, tmpl) {
    evt.preventDefault();
    var newStatus = evt.currentTarget.attributes.value.value;
    var orderId = Session.get('orderId');
    var order = Orders.findOne({_id: orderId});
    if ( _.contains(order.waiter, Meteor.userId()) ) {
      Orders.update({_id: orderId}, {$set: {status: newStatus, updated: Date.now()}});
      Session.set('orderStatus', newStatus);
    } else {
      Session.set('orderStatus', order.status);
    };
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
    Orders.update({_id: orderId}, {$set: {status: 2, updated: Date.now()}});
    swal('Merci','Votre commande est validée','success');
    Router.go('cart');
  },
  'click .addProduct': function (evt,tmpl) {
    evt.preventDefault();
    var placeId = Router.current().params.place_id;
    var orderId = Session.get('orderId');

    var currentWaiter = '';
    var userId = Meteor.userId();
    if (!Roles.userIsInRole(Meteor.user(), ['waiter'])) {
      // online cutomer order belong to place owner
      currentWaiter = tmpl.data.owner[0];
    } else {
      // this place waiter ?
      if (_.contains(tmpl.data.waiter, userId)) {
        currentWaiter = userId;
      } else {
        currentWaiter = tmpl.data.owner[0];
      };
    };
    if (!orderId) {
      OrdersNumbers.update({_id: placeId}, {$inc: {seq: 1}});
      orderNumber = OrdersNumbers.findOne({_id: placeId});
      var user = Meteor.user();
      var orderName = user.profile.name;
      if (!orderName) {
        orderName = user.emails[0].address;
      }
      var now = Date.now();
      orderId = Orders.insert({
        number: orderNumber.seq,
        name: orderName,
        total: 0.00,
        created: now,
        place: placeId,
        waiter: [currentWaiter],
        status: 1,
        user: userId
      });
      Session.set('orderId', orderId);
    };
    var productId = evt.currentTarget.attributes.id.value;
    var productName = evt.currentTarget.attributes.name.value;
    var quantity = $('#qty-'+productId).val();
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
          optionMessage += '<label class="'+option.type+'-inline" for="'+option.title+'-'+i+'">';
          optionMessage += '<input class="productOptions" type="'+option.type+'" name="'+option.title+'" id="'+option.title+'-'+i+'" value="'+choice+'">'+choice;
          optionMessage += '</label>';
        });
        optionMessage += '</div>';
        optionMessage += '</div>';
      });
      optionMessage += '</form>';

      bootbox.dialog({
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
              if($('.productOptions:checked')) {
                var optionsString = '';
                $('.productOptions:checked').each(function(index, choice) {
                  var currentOption = choice.name;
                  if (currentOption != prevOption) {
                    if (prevOption != '') {
                      optionsString += ' | ';
                    };
                    optionsString += currentOption+' : '
                    prevOption = currentOption;
                  } else {
                    optionsString += ', ';
                  };
                  optionsString += choice.value;
                });
              }
              addOrderLine(optionsString );
            }
          }
        }
      });
    } else {
      addOrderLine();
    }

    function addOrderLine (optionsString) {

      var linePrice = product.price * quantity;
      var now = Date.now();
      var lineId = Lines.insert({
        order: orderId,
        place: placeId,
        waiter: currentWaiter,
        productId: productId,
        productName: productName,
        quantity: quantity,
        price: linePrice,
        created: now,
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
    var placeId = Router.current().params.place_id;
    var orderId = Session.get('orderId');

    var currentWaiter = '';
    var userId = Meteor.userId();
    if (!Roles.userIsInRole(Meteor.user(), ['waiter'])) {
      currentWaiter = tmpl.data.owner[0];
    } else {
      // this place waiter ?
      if (_.contains(tmpl.data.waiter, userId)) {
        currentWaiter = userId;
      } else {
        currentWaiter = tmpl.data.owner[0];
      };
    };
    if (!orderId) {
      OrdersNumbers.update({_id: placeId}, {$inc: {seq: 1}});
      orderNumber = OrdersNumbers.findOne({_id: placeId});
      var user = Meteor.user();
      var orderName = user.profile.name;
      if (!orderName) {
        orderName = user.emails[0].address;
      }
      var now = Date.now();
      orderId = Orders.insert({
        number: orderNumber.seq,
        name: orderName,
        total: 0.00,
        created: now,
        place: placeId,
        waiter: [currentWaiter],
        status: 1,
        user: userId
      });
      Session.set('orderId', orderId);
    };
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
            optionMessage += '<label class="'+option.type+'-inline" for="'+option.title+'-'+i+'">';
            optionMessage += '<input class="productOptions" type="'+option.type+'" name="'+option.title+'" id="'+option.title+'-'+i+'" value="'+choice+'">'+choice;
            optionMessage += '</label>';
          });
          optionMessage += '</div>';
          optionMessage += '</div>';
        });
      }
    });
    optionMessage += '</form>';

    if(optionFound === true) {
      bootbox.dialog({
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
              if($('.productOptions:checked')) {
                var optionsString = '';
                $('.productOptions:checked').each(function(index, choice) {
                  var currentOption = choice.name;
                  if (currentOption != prevOption) {
                    if (prevOption != '') {
                      optionsString += ' | ';
                    };
                    optionsString += currentOption+' : '
                    prevOption = currentOption;
                  } else {
                    optionsString += ', ';
                  };
                  optionsString += choice.value;
                });
              }
              addOrderLine(optionsString );
            }
          }
        }
      });
    } else {
      addOrderLine();
    }


    function addOrderLine (optionsString) {

      var linePrice = set.price * quantity;
      var now = Date.now();
      var lineId = Lines.insert({
        order: orderId,
        place: placeId,
        waiter: currentWaiter,
        setId: setId,
        setName: setName,
        quantity: quantity,
        price: linePrice,
        created: now,
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