Template.orders.helpers({
  orders: function () {
    return Orders.find({}).fetch();
  }
});