Template.orderModal.helpers({
  order: function () {
    if (Session.get('orderId')) {
      var orderId = Session.get('orderId');
      return Orders.findOne({_id: orderId});
    }
  },
  lines: function () {
    if (Session.get('orderId')) {
      var orderId = Session.get('orderId');
      Meteor.subscribe('Lines', orderId);
      return Lines.find({order: orderId}).fetch();
    }
  },
  isStatusActive: function (status, orderStatus) {
    return (status == orderStatus?'active':'');
  },
  isStatusChecked: function (status, orderStatus) {
    return (status == orderStatus?'checked':'');
  }
});
