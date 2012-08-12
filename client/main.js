Template.van2go.locations = function () {
  return Locations.find({}, {sort: {name: 1}});
};

// Template.van2go.selected_name = function () {
//   var player = Players.findOne(Session.get("selected_player"));
//   return player && player.name;
// };

// Template.player.selected = function () {
//   return Session.equals("selected_player", this._id) ? "selected" : '';
// };

// Template.van2go.events = {
//   'click input.inc': function () {
//     Players.update(Session.get("selected_player"), {$inc: {score: 5}});
//   }
// };

// Template.player.events = {
//   'click': function () {
//     Session.set("selected_player", this._id);
//   }
// };
