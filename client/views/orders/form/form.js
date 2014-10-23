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
    console.log('yo',newStatus);
  },
  'click .addProduct': function (evt,tmpl) {
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
    var productId = evt.currentTarget.attributes.id.value;
    var productName = evt.currentTarget.attributes.name.value;
    var quantity = $('#qty-'+productId).val();
    // console.log(placeId, orderId, productId, productName, quantity);
    var product = Products.findOne({_id: productId});
    var linePrice = product.price * quantity;
    var now = Date.now();
    Lines.insert({
      order: orderId,
      place: placeId,
      waiter: currentWaiter,
      productId: productId,
      productName: productName,
      quantity: quantity,
      price: linePrice,
      created: now,
      status: 1,
      user: userId
    });
    Orders.update({_id: orderId}, {$inc: {total: linePrice}});
    $('#qty-'+productId).val(1);
    growl(quantity, productName+'(s) ajouté(e)(s)', 'success');
  }
});