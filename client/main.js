Template.van2go.locations = function () {
  return Locations.find({}, {sort: {name: 1}});
};

Template.van2go.selected_location = function () {
  var location = Locations.findOne(Session.get("selected_location"));
  return location && location.name;
};

Template.location.selected = function () {
  return Session.equals("selected_location", this._id) ? "selected" : '';
};

// Template.van2go.events = {
//   'click input.inc': function () {
//     Players.update(Session.get("selected_player"), {$inc: {score: 5}});
//   }
// };

Template.location.events = {
  'click': function () {
    Session.set("selected_location", this._id);
  }
};
