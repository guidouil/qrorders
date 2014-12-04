Template.orders.helpers({
  orders: function () {
    var dateFilter = Session.get('dateFilter');
    var statusFilter = Session.get('statusFilter');
    var paidFilter = Session.get('paidFilter');
    var placeId = Router.current().params._id;

    var orderQuery = {paid: paidFilter};

    if (dateFilter == 'today') {
      var yesterday = moment().subtract('days', 1).valueOf();
      orderQuery.$or = [{created: {$gt: yesterday}}, {updated: {$gt: yesterday}}];
    }
    if (statusFilter != 'all') {
      orderQuery.status  = parseFloat(statusFilter);
    }
    if (placeId) {
      orderQuery.place = placeId;
    }
    return Orders.find(orderQuery ,{sort: {updated: -1, created: -1}}).fetch();
  },
  placeId: function () {
    return Router.current().params._id;
  },
  isStatusActive: function (status, orderStatus) {
    return (status == orderStatus?'active':'');
  },
  isStatusChecked: function (status, orderStatus) {
    return (status == orderStatus?'checked':'');
  },
  isActiveDate: function (filter) {
    return (Session.get('dateFilter') == filter ?'active':'');
  },
  isActivePaid: function (filter) {
    return (Session.get('paidFilter') == filter ?'active':'');
  },
  sayMyName: function (name, placeId) {
    var currentRoute = Router.current();
    if (currentRoute.lookupTemplate() === 'Cart') {
      var place = Places.findOne({_id: placeId});
      return '<a href="#" class="placeModal" id="'+placeId+'">'+place.placename+(place.town?' - '+place.town:'')+'</a>';
    } else {
      return name;
    }
  },
  dontSayMyName: function (placename) {
    if (placename !== null) {
      var placeId = Router.current().params._id;
      return '<a href="#" class="placeModal" id="'+placeId+'">'+placename+'</a>';
    } else {
      var user = Meteor.user();
      if (user) {
        if (user.profile && user.profile.name !== '') {
          return user.profile.name;
        } else {
          return user.emails[0].address;
        }
      }
    }
  },
  selectedStatus: function(status) {
    if (Session.get('statusFilter') == status) {
      return 'selected';
    } else {
      return false;
    }
  }
});

Template.orders.events({
  'click .placeModal': function (evt,tmpl) {
    var placeId = evt.currentTarget.attributes.id.value;
    Session.set('placeId', placeId);
    $('#placeModal').modal();
  },
  'click .changeStatus': function (evt, tmpl) {
    evt.preventDefault();
    var newStatus = evt.currentTarget.attributes.value.value;
    var orderId = evt.currentTarget.attributes.id.value;
    var order = Orders.findOne({_id: orderId});
    if ( _.contains(order.waiter, Meteor.userId()) ) {
      var chat = {
        userId: Meteor.userId(),
        username: Meteor.user().profile.name,
        created: Date.now(),
        message: 'La commande vient de passer en statut : '+orderStatus(newStatus),
        side: 'left'
      };
      var notify = true;
      if (order.user === Meteor.userId()) {
        notify = false;
      }
      Orders.update({_id: orderId}, {$set: {status: newStatus, updated: Date.now(), notifyUser: notify}, $push: {chats: chat}});
      if (order.user !== Meteor.userId()) {
        Meteor.call('notify_order_status', orderId, order.user, newStatus);
      }
    }
  },
  'change #selectStatus': function (evt, tmpl) {
    var status = tmpl.find('#selectStatus').value;
    Session.set('statusFilter', status);
  },
  'click .filterDateToday': function () {
    Session.set('dateFilter', 'today');
  },
  'click .filterDateAll': function () {
    Session.set('dateFilter', 'all');
  },
  'click .filterNotPaid': function () {
    Session.set('paidFilter', false);
  },
  'click .filterPaid': function () {
    Session.set('paidFilter', true);
  },
  'click .deleteOrder': function (evt, tmpl) {
    evt.preventDefault();
    swal(
      {
        title: "Êtes vous sur ?",
        text: "La suppression d'une commande est définitive!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function(){
        var orderId = evt.currentTarget.attributes.id.value;
        Meteor.call('delete_order', orderId, function (error, result) {
          if (result) {
            swal("Supprimée", "La commande à été supprimée.", "success");
          } else {
            swal("Oups...", "La commande n'à pas été supprimée. Vous n'avez peut être pas le droit ou vous êtes déconnecté...", "error");
            console.log(error);
          }
        });
      }
    );
  }
});

Template.orders.rendered = function () {
  if (!Session.get('statusFilter')) {
    Session.set('statusFilter', 'all');
  }
  if (!Session.get('dateFilter')) {
    Session.set('dateFilter', 'today');
  }
  if (!Session.get('paidFilter')) {
    Session.set('paidFilter', false);
  }
};
