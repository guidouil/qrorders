Template.orders.helpers({
  orders: function () {
    return Orders.find({}).fetch();
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
  sayMyName: function (name, placeId) {
    var currentRoute = Router.current()
    if (currentRoute.lookupTemplate() === 'cart') {
      var place = Places.findOne({_id: placeId});
      return place.placename;
    } else {
      return name;
    }
  }
});

Template.orders.events({
  'click .changeStatus': function (evt, tmpl) {
    evt.preventDefault();
    var newStatus = evt.currentTarget.attributes.value.value;
    var orderId = evt.currentTarget.attributes.id.value;
    var order = Orders.findOne({_id: orderId});
    if ( _.contains(order.waiter, Meteor.userId()) ) {
      Orders.update({_id: orderId}, {$set: {status: newStatus}});
    };
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
          };
        });
      }
    );
  }
});