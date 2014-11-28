Template.chatOrder.events({
  'click #btn-chat': function (evt,tmpl) {
    var orderId = Router.current().params.order_id;
    var order = Orders.findOne({_id: orderId});
    var message = tmpl.find('#btn-input').value.trim();
    if (order && message) {
      var side = 'right';
      var letter = 'Q';
      if ( _.contains(order.waiter, Meteor.userId()) ) {
        side = 'left';
        letter = 'R';
      }
      var chat = {
        userId: Meteor.userId(),
        username: Meteor.user().profile.name,
        created: Date.now(),
        message: message,
        side: side,
        letter: letter
      };
      if (order.waiter[0] === Meteor.userId()) {
        Orders.update({_id: orderId}, {$set: {updated: Date.now(), notifyWaiter: false, notifyUser: true}, $push: {chats: chat}});
      }
      if (order.user === Meteor.userId()) {
        Orders.update({_id: orderId}, {$set: {updated: Date.now(), notifyWaiter: true, notifyUser: false}, $push: {chats: chat}});
      }
    }
  }
});

Template.chatOrder.helpers({
  chats: function () {
    var orderId = Router.current().params.order_id;
    var order = Orders.findOne({_id: orderId});
    if (order && order.chats) {
      return order.chats;
    }
  },
  invert: function (side) {
    if (side === 'right') {
      return 'left';
    }
    return 'right';
  },
  isRight: function (side) {
    if (side === 'right') {
      return 'pull-right';
    }
  },
  isLeft: function (side) {
    if (side === 'left') {
      return 'pull-right';
    }
  },
  getColor: function (side) {
    if (side === 'left') {
      return '55C1E7';
    }
    return '5CB85C';
  },
  notify: function () {
    var orderId = Router.current().params.order_id;
    var order = Orders.findOne({_id: orderId});
    if (order && (order.notifyUser || order.notifyWaiter)) {
      return true;
    }
    return false;
  }
});
