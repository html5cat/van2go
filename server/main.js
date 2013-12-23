/**
 * On startup, populate the Locations database.
 */
var Cloudant = { 'key': 'strusbablutionsholvenges',
                 'password': 'ATxQxV6XJt8CLqAqExnOM0O8'};

Meteor.startup(function() {

    // Limit database write to server side only
    var collections = ['locations', 'cars'];

    _.each(collections, function(collection) {
        _.each(['insert', 'update', 'remove'], function(method) {
            Meteor.default_server.method_handlers['/' + collection + '/' + method] = function() {};
        });
    });

    if (Locations.find().count() === 0) {
        for (var i = 0; i < car2go.locations.length; i++) {
            var location = car2go.locations[i]

            console.log(location.locationName);

            Locations.insert({
                name: location.locationName,
                id: location.locationId
            });
        }
    }

    updateCars()

    Meteor.publish("locations", function() {
        return Locations.find();
    });

    Meteor.publish("cars", function(selectedLocation) {
        return Cars.find({locationId: selectedLocation});
    });

});


/**
 * Returns URL to retrieve available cars at `location`.
 */
function getCarsUrl(location) {
    var location = location.name.toLowerCase().replace(/\s/g, '');

    return 'http://www.car2go.com/api/v2.1/vehicles?'+
    'oauth_consumer_key=HandiCar&loc=' + location + '&format=json'
}


function updateCars() {
    Locations.find().forEach(function(location) {
        var url = getCarsUrl(location);

        // console.log('updateCars:url', url);

        Meteor.http.get(url, function(err, response) {
            // check the returnValue of the api
            if (err) {
                console.log('API Request Failed for ' + location.name + '!');
                return;
            }

            var data = JSON.parse(response.content);

            // car2go API returns cars as elements of array placemarks
            var placemarks = data.placemarks

            // Update carCount for this location
            var carCount = Object.keys(placemarks).length;
            Locations.update({id: location.id}, {$set: {carCount: carCount} });

            // Sync the cars for this location.
            Cars.remove({locationId: location.id})

            for (var i = 0; i < placemarks.length; i++) {
                var placemark = placemarks[i];

                placemark.locationId = location.id;

                Cars.insert(placemark);
            }

            console.log('updateCars:http: ' + location.name + ' :', carCount, 'cars available');
        });
    });
}