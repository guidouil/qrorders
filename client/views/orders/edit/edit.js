Template.editOrder.rendered = function () {
  var orderId = Router.current().params.order_id;
  Session.set('orderId', orderId);
  var order = Orders.findOne({_id: orderId});
  if (order && order.status) {
    Session.set('orderStatus', order.status);
  };
};