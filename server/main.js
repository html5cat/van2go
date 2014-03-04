/**
 * On startup, populate the Locations database.
 */
var Cloudant = { 'key': 'thellyedlentedlifirlydre',
                 'password': 'fgCFIHdVMRQTxhxyL0Cf5UVY'};

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


    Meteor.publish("locations", function() {
        return Locations.find();
    });

    // Meteor.publish("cars", function(selectedLocation) {
    //     return Cars.find({locationId: selectedLocation});
    // });


    Meteor.setInterval(function () {
        updateCars();
    }, 8640000); // take 10 snapshots per day to make 2 min video of the year @30fps
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
                console.log('Car2Go API Request Failed for ' + location.name + '!');
                return;
            }

            var data = JSON.parse(response.content);

            console.log(location.id, location.name);
            data.location = location.name;
            data.locationID = location.id;
            data.timestampUNIX = Math.round(+new Date()/1000);
            data.timestamp = (new Date()).toJSON();

            saveToCloudant(data);

            // car2go API returns cars as elements of array placemarks
            var placemarks = data.placemarks;

            // Update carCount for this location
            var carCount = Object.keys(placemarks).length;

            // Locations.update({id: location.id}, {$set: {carCount: carCount} });

            // // Sync the cars for this location.
            // Cars.remove({locationId: location.id})

            // for (var i = 0; i < placemarks.length; i++) {
            //     var placemark = placemarks[i];

            //     placemark.locationId = location.id;

            //     Cars.insert(placemark);
            // }

            console.log('updateCars:http: ' + location.name + ' :', carCount, 'cars available');
        });
    });
}


function saveToCloudant (obj) {
    Meteor.http.call('POST', 'https://dybskiy.cloudant.com/car2go-march-2014/',
        { data: obj,
          auth: Cloudant.key + ':' + Cloudant.password
        },
        function(err, response) {
        // check the returnValue of the api
        if (err) {
            console.log('Cloudant', err, response);
            return;
        }

        var data = JSON.parse(response.content);
        console.log(data);
        });
    }
