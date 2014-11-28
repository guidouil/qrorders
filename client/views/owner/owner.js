Template.owner.helpers({
  isOwnerUser: function(){
    if ( !Roles.userIsInRole(Meteor.user(), ['owner']) ) {
      Router.go('resto');
    }
  },
  myPlaces: function () {
    return Places.find({owner: Meteor.userId()}).fetch();
  }
});
