Template.orders.helpers({
  orders: function () {
    return Orders.find({}).fetch();
  },
  placeId: function () {
    return Router.current().params._id;
  }
});

Template.orders.events({
  'click .deletOrder': function (evt, tmpl) {
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
        // console.log(orderId);
        Meteor.call('delete_order', orderId, function (error, result) {
          if (result) {
            swal("Supprimée", "La commande à été supprimée.", "success");
          } else {
            console.log(error);
          };
        });
      }
    );
  }
});