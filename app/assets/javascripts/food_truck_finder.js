// Food Truck Finder Application
// Overall namespace for App
window.FoodTruckFinder = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl) {
    var trucks = new FoodTruckFinder.Collections.FoodTrucks();
    var trucksInRange = new FoodTruckFinder.Collections.TrucksInRange();
    
    //fetch data and initialize router
    trucks.fetch({
      success: function() {
        new FoodTruckFinder.Routers.Router({
          "$rootEl": $rootEl,
          "allTrucks": trucks,
          "trucksInRange": trucksInRange
        });
    
        Backbone.history.start();
      }
    })
    
  }
};

$(document).ready(function(){
  FoodTruckFinder.initialize($(".content"));
});
