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
    var order = Orders.findOne({_id: orderId});
    swal(
      {
        title: "Paiement par carte",
        text: "Merci de clicker sur valider une fois la transaction validée.",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#5cb85c",
        confirmButtonText: "Valider",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(){
        Orders.update({_id: orderId}, {$set: {paid: true}});
        var placeId = Router.current().params.place_id;
        Payments.insert({
          date: Date.now(),
          card: true,
          place: placeId,
          owner: Meteor.userId(),
          order: orderId,
          total: order.total,
          user: order.user
        });
        growl('OK', 'Payement validé', 'success');
        Router.go('waiter', {_id: placeId});
      }
    );
  },
  'click .cashPay': function (evt, tmpl) {
    $('.cashForm').removeClass('hidden');
    $('#inputCash').focus();
  },
  'keyup .inputPay': function (evt, tmpl) {
    $('.creditNote').html('0.00€');
    $('.cashBack').html('0.00€');
    $('#creditNote').val(0);
    $('#cashBack').val(0);
    var cashBack = 0;
    var creditNote = 0;
    var orderId = Router.current().params.order_id;
    order = Orders.findOne({_id: orderId});
    var cash = tmpl.find('#inputCash').value;
    var ticket = tmpl.find('#inputTicket').value;
    if (ticket >= order.total) {
      creditNote = ticket - order.total;
      $('.creditNote').html(creditNote.toFixed(2)+'€');
      $('#creditNote').val(creditNote);
      if (cash > 0) {
        $('.cashBack').html(parseFloat(cash).toFixed(2)+'€');
        $('#cashBack').val(cash);
      }
    }
    if (cash > order.total && !ticket) {
      cashBack = cash - order.total;
      $('.cashBack').html(cashBack.toFixed(2)+'€');
      $('#cashBack').val(cashBack);
    }
    if (cash > 0 && cash + ticket > order.total && ticket < order.total) {
      var cashNeeded = order.total - ticket;
      cashBack = cash - cashNeeded;
      $('.cashBack').html(cashBack.toFixed(2)+'€');
      $('#cashBack').val(cashBack);
    }
  },
  'click .validCashPay': function (evt, tmpl) {
    evt.preventDefault();
    var orderId = Router.current().params.order_id;
    var order = Orders.findOne({_id: orderId});
    var placeId = Router.current().params.place_id;
    var cash = tmpl.find('#inputCash').value;
    var ticket = tmpl.find('#inputTicket').value;
    var cashBack = tmpl.find('#cashBack').value;
    var creditNote = tmpl.find('#creditNote').value;
    Payments.insert({
      date: Date.now(),
      cash: cash,
      ticket: ticket,
      cashBack: cashBack,
      creditNote: creditNote,
      place: placeId,
      owner: Meteor.userId(),
      order: orderId,
      total: order.total,
      user: order.user
    });
    Orders.update({_id: orderId}, {$set: {paid: true}});
    // credit note should be assign to user
    if (creditNote > 0 && order.user !== Meteor.userId) {
      var note = Notes.findOne({place: placeId, user: order.user});
      if (note && note._id) {
        Notes.update({_id: note._id},{$set: {updated: Date.now()}, $inc: {amount: creditNote}});
      } else {
        Notes.insert({
          place: placeId,
          owner: Meteor.userId(),
          user: order.user,
          amount: creditNote,
          created: Date.now()
        });
      }
    }
    growl('OK', 'Payement validé', 'success');
    Router.go('waiter', {_id: placeId});
  }
});
