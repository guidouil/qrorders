Meteor.methods({
  user_profile_name: function () {
    var user = Meteor.user();
    if (user && user.username !== undefined && user.profile.name === undefined) {
      var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
    }
  },
  user_set_owner: function () {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['owner']);
    };
  },
  user_set_waiter: function (placeId) {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['waiter']);
      Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.place': placeId}});
    };
  },
  create_order: function (placeId) {
    check(placeId, String);

    // managing order number
    var orderNumber = OrdersNumbers.findOne({_id: placeId});
    if (orderNumber == null) {
      OrdersNumbers.insert({_id: placeId, seq: 0});
    };
    // finaly inc and reload
    OrdersNumbers.update({_id: placeId}, {$inc: {seq: 1}});
    orderNumber = OrdersNumbers.findOne({_id: placeId});

    orderId = Orders.insert({
      number: orderNumber.seq,
      total: 0.00,
      created: Date.now(),
      place: placeId,
      waiter: [Meteor.userId()]
    });
    return orderId;
  },
  add_order_line: function(placeId, orderId, productId, productName, qty) {
    check(placeId, String);
    check(orderId, String);
    check(productId, String);
    check(productName, String);
    check(qty, Number);
    var product = Products.findOne({_id: productId});
    var linePrice = product.price * qty;
    Lines.insert({
      order: orderId,
      place: placeId,
      waiter: Meteor.userId(),
      productId: productId,
      productName: productName,
      quantity: qty,
      price: linePrice,
      created: Date.now()
    });
    Orders.update({_id: orderId}, {$inc: {total: linePrice}});
    return true;
  },
  delete_order: function(orderId) {
    check(orderId, String);
    var localOrder = Orders.findOne({_id: orderId, waiter: Meteor.userId()});
    if (localOrder) {
      Lines.remove({order: localOrder._id});
      Orders.remove({_id: localOrder._id});
      // console.log(localOrder, 'OK');
      return true;
    } else {
      // console.log(localOrder, 'KO');
      return false;
    };
  }
});