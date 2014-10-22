Template.createOrder.rendered = function () {
  var placeId = Router.current().params._id;
  Meteor.call('create_order', placeId, function (error, result) {
    if (!error) {
      Session.set('orderId', result);
    };
  });
};