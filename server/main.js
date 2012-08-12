Meteor.startup(function () {
  if (Locations.find().count() === 0) {
    for (var i = 0; i < car2go.locations.length; i++)
      Locations.insert({name: car2go.locations[i].locationName});
  }

  if (Cars.find().count() === 0) {
    for (var i = 0; i < car2go.cars.length; i++)
      Cars.insert({name: car2go.cars[i].name, locationId: 4});
  }

});