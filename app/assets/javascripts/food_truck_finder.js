// Food Truck Finder Application
// Overall namespace for App
window.FoodTruckFinder = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var trucks = new FoodTruckFinder.Collections.FoodTrucks();
    
    //fetch JSON data from endpoint and initialize router
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
