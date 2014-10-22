Template.editOrder.rendered = function () {
  var orderId = Router.current().params.order_id;
  Session.set('orderId', orderId);
};