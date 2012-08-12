/**
 * On startup, populate the Locations database.
 */
Meteor.startup(function() {
    //if (Locations.find().count() === 0) {
    if (1) {
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

    return 'http://www.car2go.com/api/v2.1/vehicles?&oauth_consumer_key=HandiCar&loc=' + location + '&format=json'
}


function updateCars() {
    Locations.find().forEach(function(location) {
        var url = getCarsUrl(location);

        Meteor.http.get(url, function(err, response) {
            if (err) {
                console.log('API Request Failed!');
                return;
            }

            // try{}
            var data = JSON.parse(response.content);
            // check the returnValue of the api
            var placemarks = data.placemarks

            // Sync the cars for this location.
            Cars.remove({locationId: location.id})

            for (var i = 0; i < placemarks.length; i++) {
                var placemark = placemarks[i];
                Cars.insert({
                    name: placemark.name,
                    locationId: location.id
                });
            }

            // console.log('updateCars:http: Added Cars -', placemarks.length);
        });
    });
}