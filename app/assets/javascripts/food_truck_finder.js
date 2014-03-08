window.FoodTruckFinder = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    FoodTruckFinder.trucks = new FoodTruckFinder.Collections.FoodTrucks();
    alert('Hello from Backbone!');
    Backbone.history.start();
  }
};

$(document).ready(function(){
  FoodTruckFinder.initialize();
});
