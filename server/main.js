Meteor.startup(function () {
  if (Locations.find().count() === 0) {
    for (var i = 0; i < car2go.locations.length; i++)
      Locations.insert({name: car2go.locations[i].locationName});
  }
});