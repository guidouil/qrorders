Template.editOrder.rendered = function () {
  var orderId = Router.current().params.order_id;
  Session.set('orderId', orderId);
  var order = Orders.findOne({_id: orderId});
  if (order && order.status) {
    Session.set('orderStatus', order.status);
  }
};

Template.editOrder.helpers({
  isWaiter: function () {
    var placeId = Router.current().params.place_id;
    var place = Places.findOne({_id: placeId});
    if (place && _.contains(place.waiter, Meteor.userId())) {
      return true;
    } else {
      return false;
    }
  },
  placeId: function () {
    return Router.current().params.place_id;
  },
  orderId: function () {
    return Router.current().params.order_id;
  },
  order: function () {
    var orderId = Router.current().params.order_id;
    return Orders.findOne({_id: orderId});
  }
});
