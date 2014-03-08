window.FoodTruckFinder = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var trucks = new FoodTruckFinder.Collections.FoodTrucks();
    trucks.fetch({
      success: function() {
        new FoodTruckFinder.Routers.Router({
          "$rootEl": $(".content"),
          "collection": trucks
        });
    
        Backbone.history.start();
      }
    })
    
  }
};

$(document).ready(function(){
  FoodTruckFinder.initialize();
});
