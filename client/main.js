Meteor.subscribe("locations");

function getSelectedLocation() {
    var locationId = Session.get("selected_location");
    if (!locationId) return null;
    return Locations.findOne({id: locationId});
}

Template.van2go.locations = function () {
    return Locations.find({}, {sort: {name: 1} });
};

Template.van2go.cars = function () {
    var locationId = Session.get("selected_location")
    console.log('Template.van2go.cars:locationId:', locationId);
    return Cars.find({locationId: locationId});
};

Template.van2go.selected_location = function () {
    var location = getSelectedLocation()
    return location && location.name;
};

Template.location.selected = function () {
    return Session.equals("selected_location", this.id) ? "selected" : '';
};

Template.location.events = {
    'click': function () {
        // Session.set("selected_location", this._id);
        console.log('Saving selected_location', this.id);
        Session.set("selected_location", this.id);
        Meteor.subscribe("cars", this.id);
    }
};
