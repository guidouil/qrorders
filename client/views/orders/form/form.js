Template.formOrder.helpers({
  place: function() {
    var placeId = Router.current().params.place_id;
    Session.set('placeId', placeId);
    return Places.findOne({_id: placeId});
  },
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
  'click .addProduct': function (evt,tmpl) {
    evt.preventDefault();
    var placeId = Router.current().params.place_id;
    var orderId = Session.get('orderId');
    if (!orderId) {
      OrdersNumbers.update({_id: placeId}, {$inc: {seq: 1}});
      orderNumber = OrdersNumbers.findOne({_id: placeId});

      orderId = Orders.insert({
        number: orderNumber.seq,
        total: 0.00,
        created: Date.now(),
        place: placeId,
        waiter: [Meteor.userId()]
      });
      Session.set('orderId', orderId);
    };
    var productId = evt.currentTarget.attributes.id.value;
    var productName = evt.currentTarget.attributes.name.value;
    var quantity = $('#qty-'+productId).val();
    // console.log(placeId, orderId, productId, productName, quantity);
    var product = Products.findOne({_id: productId});
    var linePrice = product.price * quantity;
    Lines.insert({
      order: orderId,
      place: placeId,
      waiter: Meteor.userId(),
      productId: productId,
      productName: productName,
      quantity: quantity,
      price: linePrice,
      created: Date.now()
    });
    Orders.update({_id: orderId}, {$inc: {total: linePrice}});
    growl(quantity, productName+'(s) ajouté(e)(s)', 'success');
  }
});