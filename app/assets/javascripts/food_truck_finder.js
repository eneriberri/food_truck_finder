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
    var infoWindow = new google.maps.InfoWindow({}); //marker info
    //fetch JSON data from endpoint and initialize router
    trucks.fetch({
      success: function() {
        new FoodTruckFinder.Routers.Router({
          "$rootEl": $rootEl,
          "allTrucks": trucks,
          "trucksInRange": trucksInRange,
          "infoWindow": infoWindow
        });
    
        Backbone.history.start();
      }
    })
    
  }
};

$(document).ready(function(){
  FoodTruckFinder.initialize($(".content"));
});
