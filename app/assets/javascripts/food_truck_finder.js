window.FoodTruckFinder = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    FoodTruckFinder.trucks = new FoodTruckFinder.Collections.FoodTrucks();
    console.log(FoodTruckFinder.trucks);
    
    new FoodTruckFinder.Routers.Router({
      "$rootEl": $(".content")
    });
    Backbone.history.start();
  }
};

$(document).ready(function(){
  FoodTruckFinder.initialize();
});
