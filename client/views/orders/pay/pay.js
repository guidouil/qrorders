Template.payOrder.helpers({
  order: function () {
    var orderId = Router.current().params.order_id;
    return Orders.findOne({_id: orderId});
  },
  lines: function () {
    var orderId = Router.current().params.order_id;
    return Lines.find({order: orderId}).fetch();
  }
});

Template.payOrder.events({
  'click .cardPay': function (evt, tmpl) {
    $('.cashForm').addClass('hidden');
    var orderId = Router.current().params.order_id;
    swal(
      {
        title: "Paiement par carte",
        text: "Merci de clicker sur valider une fois la transaction validée.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Valider",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(){
        Orders.update({_id: orderId}, {$set: {paid: true}});
        growl('OK', 'Payement validé', 'success');
        var placeId = Router.current().params.place_id;
        Router.go('waiter', {_id: placeId});
      }
    );
  },
  'click .cashPay': function (evt, tmpl) {
    $('.cashForm').removeClass('hidden');
    $('#inputCash').focus();
  },
  'keyup .inputPay': function (evt, tmpl) {
    var orderId = Router.current().params.order_id;
    $('.creditNote').html('0.00€');
    $('.cashBack').html('0.00€');
    order = Orders.findOne({_id: orderId});
    var cash = tmpl.find('#inputCash').value;
    var ticket = tmpl.find('#inputTicket').value;
    if (ticket > order.total && !cash) {
      $('.creditNote').html(ticket - order.total);
    }
    if (cash > order.total && !ticket) {
      $('.cashBack').html(cash - order.total);
    }
    if (cash + ticket > order.total) {
      var cashNeeded = order.total - ticket;
      $('.cashBack').html(cash - cashNeeded);
    }
  }
});
