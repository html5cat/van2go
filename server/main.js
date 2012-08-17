/**
 * On startup, populate the Locations database.
 */
Meteor.startup(function() {
    if (Locations.find().count() === 0) {
    // if (1) {
        for (var i = 0; i < car2go.locations.length; i++) {
            var location = car2go.locations[i]

            // If you just want Vancouver.
            // if (location.locationId != 4) continue;

            Locations.insert({
                name: location.locationName,
                id: location.locationId
            });
        }
    }

    updateCars()
});


/**
 * Returns URL to retrieve available cars at `location`.
 */
function getCarsUrl(location) {
    var location = location.name.toLowerCase().replace(/\s/g, '');

    return 'http://www.car2go.com/api/v2.1/vehicles?'+
    '&oauth_consumer_key=HandiCar&loc=' + location + '&format=json'
}


function updateCars() {
    Locations.find().forEach(function(location) {
        var url = getCarsUrl(location);

        console.log('updateCars:url', url);

        Meteor.http.get(url, function(err, response) {
            // check the returnValue of the api
            if (err) {
                console.log('API Request Failed!');
                return;
            }

            var data = JSON.parse(response.content);

            // car2go API returns cars as elements of array placemarks
            var placemarks = data.placemarks

            // Update carCount for this location
            var carCount = Object.keys(placemarks).length;
            Locations.update({id: location.id}, {$set: {carCount: carCount} });

            // Sync the cars for this location.
            // Cars.remove({locationId: location.id})

            for (var i = 0; i < placemarks.length; i++) {
                var placemark = placemarks[i];
                Cars.insert({
                    name: placemark.name,
                    locationId: location.id
                });
            }

            console.log('updateCars:http: Found Cars -', carCount);
        });
    });
}