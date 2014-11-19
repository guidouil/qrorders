Template.a.helpers({
  gogogo: function () {
    var searched = Router.current().params.searched;
    var place = Places.findOne({code: searched});
    console.log(place);
    if (place && place._id) {
      Router.go('createOrder', {place_id: place._id});
    } else {
      Router.go('search', {searched: searched});
    }
  }
});
