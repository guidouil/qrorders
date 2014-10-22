Template.createOrder.rendered = function () {
  var placeId = Router.current().params._id;
  Meteor.call('create_order', placeId, function (error, result) {
    if (!error) {
      Session.set('orderId', result);
    };
  });
};

Template.createOrder.helpers({
  products: function () {
    return Products.find().fetch();
  },
  order: function () {
    var orderId = Session.get('orderId');
    // console.log(orderId);
    return Orders.findOne({_id: orderId});
  },
  lines: function() {
    var orderId = Session.get('orderId');
    return Lines.find({order: orderId}).fetch();
  },
  orderCount: function () {
    return Orders.find().count();
  },
  currentDate: function () {
    return moment().format("DD/MM/YYYY HH:mm");
  }
});

Template.createOrder.events({
  'click .addProduct': function (evt,tmpl) {
    evt.preventDefault();
    var placeId = tmpl.data._id;
    var orderId = Session.get('orderId');
    var productId = evt.currentTarget.attributes.id.value;
    var productName = evt.currentTarget.attributes.name.value;
    //@TODO product options
    bootbox.dialog({
      title: "Quantity",
      message: '<div class="row">  ' +
              '<div class="col-xs-12"> ' +
              '<form class="form-horizontal"> ' +
              '<div class="form-group"> ' +
              '<input id="qty" name="qty" type="number" placeholder="Quantity" class="form-control input-md" value="1"> ' +
              '</div>' +
              '</form></div></div>',
      buttons: {
        success: {
          label: "Add",
          className: "btn-success",
          callback: function () {
            var qty = $('#qty').val();
            // console.log(placeId, orderId,productId, productName, parseFloat(qty));
            if (qty > 0) {
              Meteor.call('add_order_line', placeId, orderId, productId, productName, parseFloat(qty), function (error, result) {
                if(!error) {
                  growl(qty, productName+'(s) ajouté(e)(s)', 'success');
                }
              });
            };
          }
        }
      }
    });
    if (tmpl.find('#qty')) {
      tmpl.find('#qty').focus();
    };
  }
});