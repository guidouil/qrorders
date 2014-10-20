Meteor.methods({
  user_profile_name: function () {
    var user = Meteor.user();
    if(user && user.username !== undefined && user.profile.name === undefined) {
      var name = user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
      Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.name': name}});
    }
  },
  user_set_owner: function() {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['owner']);
    };
  },
  user_set_waiter: function() {
    if (Meteor.userId()) {
      Roles.addUsersToRoles(Meteor.userId(), ['waiter']);
    };
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
    Orders.update({_id: orderId}, {$inc:{total: linePrice}});
    return true;
  }
});